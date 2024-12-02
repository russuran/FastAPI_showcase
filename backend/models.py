from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Philial(Base):
    __tablename__ = 'philials'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    info = Column(String)
    adress = Column(String)
    payment = Column(Integer)
    expenses = Column(Integer)
    comment = Column(String)
    amount_of_groups = Column(Integer)
    amount_of_students = Column(Integer)

    stocks = relationship("Stock", back_populates="philial")
    leads = relationship("Lead", back_populates="philial")
    groups = relationship("Group", back_populates="philial")

class Stock(Base):
    __tablename__ = 'stock'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    amount = Column(Integer)
    philial_id = Column(Integer, ForeignKey('philials.id'))

    philial = relationship("Philial", back_populates="stocks")

class Lead(Base):
    __tablename__ = 'lead'
    
    id = Column(Integer, primary_key=True)
    kid_name = Column(String)
    kid_phone = Column(String)
    kid_email = Column(String)
    parent_name = Column(String)
    parent_phone = Column(String)
    day_of_birth = Column(String)
    philial_id = Column(Integer, ForeignKey('philials.id'))
    how_known = Column(String)
    state = Column(String)
    comment = Column(String)
    manager_id = Column(Integer, ForeignKey('worker.id'))

    philial = relationship("Philial", back_populates="leads")
    manager = relationship("Worker", back_populates="leads")
    users = relationship("User", back_populates="lead")  # Связь с User

class Role(Base):
    __tablename__ = 'role'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    can_manage_leads = Column(Boolean)
    can_manage_groups = Column(Boolean)
    can_manage_courses = Column(Boolean)
    can_manage_storage = Column(Boolean)
    can_view_stats = Column(Boolean)
    is_teacher = Column(Boolean)

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True)
    full_name = Column(String)
    age = Column(Integer)
    login = Column(String)
    password = Column(String)
    img = Column(String)
    balance = Column(Integer)
    lead_id = Column(Integer, ForeignKey('lead.id'))
    role_id = Column(Integer, ForeignKey('role.id'))

    lead = relationship("Lead", back_populates="users")  # Обратная связь с Lead
    role = relationship("Role")
    user_groups = relationship("UserGroup", back_populates="user")
    diplomas = relationship("Diploma", back_populates="user")
    lesson_passage_data = relationship("LessonPassageData", back_populates="user")
    task_passage_data = relationship("TaskPassageData", back_populates="user")
    group_passages = relationship("GroupPassage", back_populates="user")


class Group(Base):
    __tablename__ = 'group'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    duration_start = Column(String)
    duration_end = Column(String)
    description = Column(String)
    course_id = Column(Integer, ForeignKey('course.id'))
    teacher_id = Column(Integer, ForeignKey('worker.id'))
    assistant_id = Column(Integer, ForeignKey('worker.id'))
    philial_id = Column(Integer, ForeignKey('philials.id'))
    teacher_payment = Column(Integer)
    assistant_payment = Column(Integer)

    course = relationship("Course", back_populates="groups")
    philial = relationship("Philial", back_populates="groups")
    teacher = relationship("Worker", foreign_keys=[teacher_id])
    assistant = relationship("Worker", foreign_keys=[assistant_id])
    user_groups = relationship("UserGroup", back_populates="group")
    group_passages = relationship("GroupPassage", back_populates="group")
    schedules = relationship("GroupSchedule", back_populates="group")

class GroupSchedule(Base):
    __tablename__ = 'group_schedule'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    duration = Column(Integer)
    period = Column(String)
    onetime = Column(Boolean)
    cabinet = Column(String)
    group_id = Column(Integer, ForeignKey('group.id'))

    group = relationship("Group", back_populates="schedules")

class Course(Base):
    __tablename__ = 'course'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    img = Column(String)
    description = Column(String)
    num_of_lessons = Column(Integer)
    num_of_tasks = Column(Integer)

    groups = relationship("Group", back_populates="course")
    lessons = relationship("Lesson", back_populates="course")

class UserGroup(Base):
    __tablename__ = 'user_group'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    group_id = Column(Integer, ForeignKey('group.id'))

    user = relationship("User", back_populates="user_groups")
    group = relationship("Group", back_populates="user_groups")


class Lesson(Base):
    __tablename__ = 'lesson'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    manual_file = Column(String)
    course_id = Column(Integer, ForeignKey('course.id'))

    course = relationship("Course", back_populates="lessons")
    tasks = relationship("Task", back_populates="lesson")
    lesson_passage_data = relationship("LessonPassageData", back_populates="lesson")

class Task(Base):
    __tablename__ = 'task'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    compiler_type = Column(String)
    task_file_tests = Column(String)
    lesson_id = Column(Integer, ForeignKey('lesson.id'))

    lesson = relationship("Lesson", back_populates="tasks")
    task_passage_data = relationship("TaskPassageData", back_populates="task")

class TaskPassageData(Base):
    __tablename__ = 'task_passage_data'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    task_id = Column(Integer, ForeignKey('task.id'))
    passed = Column(Boolean)
    time_used = Column(Integer)
    memory_used = Column(Integer)

    user = relationship("User", back_populates="task_passage_data")
    task = relationship("Task", back_populates="task_passage_data")

class LessonPassageData(Base):
    __tablename__ = 'lesson_passage_data'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    lesson_id = Column(Integer, ForeignKey('lesson.id'))
    passed = Column(Boolean)

    user = relationship("User", back_populates="lesson_passage_data")
    lesson = relationship("Lesson", back_populates="lesson_passage_data")

class Diploma(Base):
    __tablename__ = 'diploma'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    course_name = Column(String)
    description = Column(String)
    filepath = Column(String)
    mark = Column(String)
    year = Column(Integer)
    img = Column(String)
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship("User", back_populates="diplomas")

class Worker(Base):
    __tablename__ = 'worker'
    
    id = Column(Integer, primary_key=True)
    login = Column(String)
    password = Column(String)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    role_id = Column(Integer, ForeignKey('role.id'))
    day_of_birth = Column(String)
    telegramm = Column(String)
    vk = Column(String)
    comment = Column(String)
    payment_per_hour = Column(Integer)
    payment_per_month = Column(Integer)

    role = relationship("Role")
    leads = relationship("Lead", back_populates="manager")
    groups_as_teacher = relationship("Group", foreign_keys=[Group.teacher_id], viewonly=True)
    groups_as_assistant = relationship("Group", foreign_keys=[Group.assistant_id], viewonly=True)

class GroupPassage(Base):
    __tablename__ = 'group_passage'
    
    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey('group.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    comment = Column(String)
    date = Column(String)

    group = relationship("Group", back_populates="group_passages")
    user = relationship("User", back_populates="group_passages")


class Abonements(Base):
    __tablename__ = 'abonements'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Integer)
    lessons_amount = Column(Integer)
