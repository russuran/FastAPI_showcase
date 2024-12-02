from fastapi import (
    Response,
    Depends,
    Header,
    HTTPException
)

from typing import (
    Dict,
    Any
)

from schemas import *

from models import *

from utils import (
    db_dep, 
    current_user_dep, 
    ACCESS_TOKEN_EXPIRE_MINUTES, 
    create_access_token,
    load_tests
)

from datetime import timedelta

from fastapi.responses import JSONResponse


import io
import sys
import importlib.util
import tracemalloc, time
import traceback

from fastapi import APIRouter

router = APIRouter(prefix="/lms")



@router.post("/login")
async def login(db: db_dep, data: LoginSchema, response: Response):
    user = db.query(User).filter(User.login == data.username).first()

    if user is not None:
        if user.password == data.password:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
            
            response.status_code = 200
            return {"access_token": access_token, "token_type": "bearer"}

    response.status_code = 401
    return {"error": "Неверный логин или пароль"}

@router.get("/me")
async def read_users_me(current_user: current_user_dep):
    return current_user


@router.post("/list_of_courses")
async def list_of_сourses(db: db_dep, current_user: current_user_dep):
    user_course_deps = db.query(UserGroup).filter(UserGroup.user_id == current_user.id).all()

    ret_list = []
    for dep in user_course_deps:
        ret = {}
        group = db.query(Group).filter(Group.id == dep.group_id).first()
        course = db.query(Course).filter(Course.id == group.course_id).first()
        ret["id"] = group.course_id
        ret["course_name"] = course.name
        ret["teacher"] = db.query(User).filter(User.id == group.teacher_id).first().full_name
        ret["img"] = course.img
        ret["total"] = course.num_of_lessons
        ret["completed"] = db.query(LessonPassageData).filter(LessonPassageData.user_id == current_user.id).count()
        ret_list.append(ret)
    return ret_list


@router.post("/list_of_diplomas")
async def list_of_diplomas(db: db_dep, current_user: current_user_dep):
    user_diplomas = db.query(Diploma).filter(Diploma.user_id == current_user.id).all()

    ret_list = []
    for diploma in user_diplomas:
        ret = {}
        ret["id"] = diploma.id
        ret["year"] = diploma.year
        ret["title"] = diploma.name + " " + diploma.course_name
        ret["mark"] = diploma.mark
        ret_list.append(ret)
    return ret_list


@router.post("/check_course")
async def get_user(db: db_dep, data: CourseCheck, current_user: current_user_dep):
    course_check = (
        db.query(UserGroup)
        .filter(UserGroup.user_id == current_user.id)
        .first()
    )
    if not course_check:
        user_data = {"id": current_user.id, "full_name": current_user.full_name, "img": current_user.img}
        response_data = {"user": user_data}
        return JSONResponse(content=response_data, status_code=404)
    
    list_of_themes = []
    for theme in db.query(Lesson).filter(Lesson.course_id == data.id).all():
        try:
            theme.passed = bool(db.query(LessonPassageData).filter(LessonPassageData.user_id == current_user.id and
                                LessonPassageData.lesson_id == theme.id).first().passed)
        except:
            theme.passed = False
    
        list_of_themes.append(theme)
    
    course_name = db.query(Course).filter(Course.id == data.id).first().name

    return {'user': current_user, 'themes': list_of_themes, 'course_name': course_name}


@router.get("/get_tasks/{lesson_id}")
async def get_tasks(
    db: db_dep, 
    lesson_id: int,
    current_user: current_user_dep 
):
    tasks = db.query(Task).filter(Task.lesson_id == lesson_id).all()
    ret_list = []
    for task in tasks:
        ret = {}
        ret["id"] = task.id
        ret["name"] = task.name
        ret["testfile"] = task.task_file_tests
        ret["description"] = task.description
        ret["passed"] = bool(db.query(TaskPassageData).filter(TaskPassageData.task_id == task.id and
                             TaskPassageData.user_id == current_user.id).first())
        print(ret["testfile"])
        ret_list.append(ret)

    return ret_list


@router.post("/get_user")
async def get_user(
    db: db_dep, 
    current_user: current_user_dep
):
    return current_user



@router.post("/get_user_heatmap")
async def get_user_heatmap(
    db: db_dep,
    current_user: current_user_dep
):
    data = [2, 0, 3, 0, 5, 6, 2, 1, 2, 5, 0, 0, 1, 3, 4, 6, 7, 2, 0, 1, 7, 2, 6, 8, 9, 2, 7, 2, 5, 5]
    return data


@router.post("/execute")
async def execute_code_with_test(
    request: CodeExecute,
    db: db_dep,
    current_user: current_user_dep
):

    output = io.StringIO()
    sys.stdout = output

    try:
        tests = load_tests(request.testfile)
        
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="User code cannot be empty.")

        wrapped_code = f"def user_function():\n" + "\n".join(f"    {line}" for line in request.code.splitlines())
        
        tracemalloc.start()
        
        start_time = time.time()
        try:
            exec(wrapped_code, globals())
            user_function()
        except Exception as e:
            return {
                "err": "Ошибка в коде",
                "description": traceback.format_exc()
            }

        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        end_time = time.time()
        execution_time = end_time - start_time

        sys.stdout = sys.__stdout__
        result_output = output.getvalue()
        results = {}
        for test_name, expected_value in tests.items():
            if 'test_name' in locals():
                result_name = locals()['test_name']
                result = locals()['result_output']

                if result[-1] == '\n':
                    result = result[:-1]

                results[test_name] = (result, result == expected_value)
                if result != expected_value:
                    
                    return {
                        "err": "Ошибка в тесте",
                        "description": f'Ожидаемый ответ:\n{expected_value}\nПолученный ответ:\n{result}'
                    }
        
        task_passage = TaskPassageData()
        task_passage.user_id = current_user.id
        task_passage.task_id = request.task_id
        task_passage.passed = True
        task_passage.time_used = round(execution_time, 5)
        task_passage.memory_used = round(current / 1024, 3)
        

        
        db.add(task_passage)
        db.commit()
        db.refresh(task_passage)
        
        lesson_id = db.query(Task).filter(Task.id == request.task_id).first().lesson_id
        all_tasks = db.query(Task.id).filter(Task.lesson_id == lesson_id).all()

        if all(db.query(TaskPassageData).filter(TaskPassageData.task_id == task[0]).first() for task in all_tasks):
            lesson_passage = LessonPassageData()
            lesson_passage.user_id = current_user.id
            lesson_passage.lesson_id = lesson_id
            lesson_passage.passed = True

            db.add(lesson_passage)
            db.commit()
            db.refresh(lesson_passage)

        return {
            "status": "passed",
            "description": f'Память: {round(current / 1024, 3)} КБ\nВремя: {round(execution_time, 5)}'
        }
    except Exception as e:
        sys.stdout = sys.__stdout__
        detail = str(e)
        print(traceback.format_exc())
        if str(e) == '400: User code cannot be empty.':
            detail = "Поле 'Код' не может быть пустым."
        raise HTTPException(status_code=400, detail=detail)
