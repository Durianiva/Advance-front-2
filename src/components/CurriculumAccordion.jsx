import { useState } from "react";

// # curriculum-item
function CurriculumItem({ title, items, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="curriculum-item">
      <div className="curriculum-item-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <i className={open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
      </div>

      {open && items.length > 0 && (
        <div className="curriculum-item-body">
          {items.map((lesson, index) => (
            <div className="curriculum-lesson" key={index}>
              <span className="curriculum-lesson-name">{lesson.name}</span>
              <span className="curriculum-lesson-meta">
                <span>
                  <i className="ri-play-circle-line"></i> Video
                </span>
                <span>
                  <i className="ri-time-line"></i> {lesson.duration}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// # curriculum-accordion
function CurriculumAccordion({ curriculum }) {
  return (
    <div className="curriculum-accordion">
      {curriculum.map((section, index) => (
        <CurriculumItem
          key={index}
          title={section.title}
          items={section.items}
          defaultOpen={false}
        />
      ))}
    </div>
  );
}

export default CurriculumAccordion;
