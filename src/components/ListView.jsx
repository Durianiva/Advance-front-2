import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
export default function ListView({ category }) {
 const courses = useSelector(state => state.courses.items);
 return courses.filter(course => category === "semua" || course.category === category).map(course => <CourseCard key={course.id} {...course} />);
}
