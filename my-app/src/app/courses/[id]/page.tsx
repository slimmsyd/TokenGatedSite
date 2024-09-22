"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import Video from "@/app/components/Video";
import Link from "next/link";
interface Module {
  id: number;
  title: string;
  videoURL: string;
  concepts: string[];
  objectives: string[];
  activities: string[];
}

interface Course {
  id: number;
  title: string;
  videoURL: string;
  author: string;
  date: string;
  modules: Module[];
}
export default function CoursePage() {
  const { id } = useParams();
  const { address } = useAccount();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  useEffect(() => {
    const fetchCourse = async () => {
      const response = await fetch(`/api/courses/${id}`);
      const data = await response.json();
      setCourse(data);
      console.log("This is the course", data);
      //   console.log("This is the videoURL", data.modules[0].videoURL)
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    console.log("Logign courses modules", course);
  }, [course]);

  useEffect(() => {
    console.log("Admin mode is", isAdminMode);
  }, [isAdminMode]);

  if (!course) {

    return(
      <div className = "min-h-screen w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl">
          Loading
          <span className="animate-typing">...</span>
        </h1>
      </div>
    )



  }

  // ... existing useEffect for fetching course ...

  const handleEditModule = (
    moduleId: number,
    field: string,
    currentContent: string
  ) => {
    setEditingModuleId(moduleId);
    setEditingField(field);
    setEditedContent(currentContent);
  };

  const handleSaveModule = async (moduleId: number) => {
    if (!course) return;

    const updatedModules = course.modules.map((module) =>
      module.id === moduleId
        ? { ...module, [editingField as keyof Module]: editedContent }
        : module
    );

    const updatedCourse = { ...course, modules: updatedModules };

    // Update local state
    setCourse(updatedCourse);

    // Send update to API
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      console.error("Failed to update course:", error);
      // Optionally, revert the local state change here
    }

    setEditingModuleId(null);
    setEditingField(null);
  };

  return (
    <div className="main-container min-h-screen w-full flex flex-col items-start justify-start">
      <div className="flex flex-row px-[10px] items-center justify-center gap-[10px] mb-[10px]">
        <Link href="/"> {`[home]`}</Link>
        <Link href="/courses"> {`[courses]`}</Link>
      </div>
      <div className="videoContainer h-[500px] w-full">
        <Video
          src={course.videoURL || course.modules[0]?.videoURL || ""}
          type="video/mp4"
          width="100%"
          height="100%"
          controls={true}
          autoPlay={true}
          loop={true}
          muted={true}
          className="pointerEventsYes h-full"
        />
      </div>

      <button
        onClick={() => setIsAdminMode(!isAdminMode)}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 mb-4"
      >
        {isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
      </button>
      <div className="flex flex-col items-start justify-start gap-[10px] p-4 w-full">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p>Author: {course.author}</p>
        <p>Date: {course.date}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Modules</h2>

        <div className="mt-8 w-full">
          {course && course.modules && course.modules.length > 0 ? (
            course.modules.map((module) => (
              <div
                key={module.id}
                className="mb-8 p-4 border rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-4">{module.title}</h2>
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">Key Concepts:</h3>
                  <ul className="list-disc list-inside">
                    {module.concepts.map((concept, i) => (
                      <li key={i} className="text-base">
                        {concept}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">
                    Learning Objectives:
                  </h3>
                  <ul className="list-disc list-inside">
                    {module.objectives.map((objective, i) => (
                      <li key={i} className="text-base">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Activities:</h3>
                  <ul className="list-disc list-inside">
                    {module.activities.map((activity, i) => (
                      <li key={i} className="text-base">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No modules available for this course.</p>
          )}

          {course && isAdminMode
            ? course.modules.map((module) => (
                <div
                  key={module.id}
                  className="mb-8 p-4 border rounded-lg shadow-md"
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    {module.title}
                  </h2>

                  {[
                    "videoURL",
                    "title",
                    "concepts",
                    "objectives",
                    "activities",
                  ].map((field) => (
                    <div key={field} className="mb-4">
                      <h3 className="text-xl font-medium mb-2">
                        {field === "videoURL"
                          ? "Video URL"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                        :
                      </h3>
                      {editingModuleId === module.id &&
                      editingField === field ? (
                        <>
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={field === "videoURL" ? 1 : 3}
                          />
                          <button
                            onClick={() => handleSaveModule(module.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          {field === "videoURL" ? (
                            <p>{module.videoURL}</p>
                          ) : field === "title" ? (
                            <p>{module.title}</p>
                          ) : (
                            <ul className="list-disc list-inside">
                              {(module[field as keyof Module] as string[]).map(
                                (item, i) => (
                                  <li key={i} className="text-base">
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                          <button
                            onClick={() =>
                              handleEditModule(
                                module.id,
                                field,
                                field === "videoURL" || field === "title"
                                  ? (module[field as keyof Module] as string)
                                  : (
                                      module[field as keyof Module] as string[]
                                    ).join("\n")
                              )
                            }
                            className="bg-gray-200 px-4 py-2 rounded mt-2"
                          >
                            Edit {field === "videoURL" ? "Video URL" : field}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {/* ... rest of the module content ... */}
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
