import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, addCourse, editCourse, deleteCourse } from "../store/redux/coursesSlice";
export function useCourses() {
  const dispatch = useDispatch();
  const state = useSelector(state => state.courses);
  useEffect(() => { if (state.status === "idle") dispatch(fetchCourses()); }, [dispatch, state.status]);
  return { ...state,
    refresh: () => dispatch(fetchCourses()).unwrap(),
    add: data => dispatch(addCourse(data)).unwrap(),
    edit: (id, data) => dispatch(editCourse({ id, data })).unwrap(),
    remove: id => dispatch(deleteCourse(id)).unwrap(),
  };
}
