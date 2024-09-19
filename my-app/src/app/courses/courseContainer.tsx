"use client";
import { useState, useEffect } from "react";
import Video from "../components/Video";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

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

export default function CourseContainer() {
  const { isConnected, address } = useAccount();

  const ADMINADDRESS = "0xDcFD8d5BD36667D16aDDD211C59BCdE1A9c4e23B";
  const [course, setCourse] = useState<Course | null>(null);
  const [showAddModule, setShowAddModule] = useState<boolean>(false);
  const [newModule, setNewModule] = useState<Omit<Module, "id">>({
    title: "",
    videoURL: "",
    concepts: [""],
    objectives: [""],
    activities: [""],
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the course data when the component mounts
    if (selectedCourseId) {
      fetchCourse(selectedCourseId);
    } else if (selectedCourseId === 0) {
      console.log("This is the selected course id", selectedCourseId);
      fetchCourse(0);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

 const router = useRouter();
  const handleCourseSelect = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };



  const fetchCourses = async () => {
    const response = await fetch("/api/courses");
    const data = await response.json();
    console.log("This is the data fetched", data);
    setCourses(data.courses);
  };

  const fetchCourse = async (id: number) => {
    const response = await fetch(`/api/courses/${id}`);
    const data = await response.json();
    console.log("This is the data", data);
    setCourse(data);
  };

  const [showAddCourse, setShowAddCourse] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id" | "modules">>({
    title: "",
    videoURL: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    console.log("This is the course here after fetch", course);
  }, [course]);

  const addCourse = async () => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add course: ${response.status} ${
            response.statusText
          }. ${JSON.stringify(errorData)}`
        );
      }

      if (response.ok) {
        const addedCourse = await response.json();
        setCourse(addedCourse);
        setShowAddCourse(false);
      } else {
        throw new Error("Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      // Handle error (e.g., set error message state)
    }
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted course from the courses state
        setCourses(courses.filter(c => c.id !== courseId));
        // Reset the selected course if it was the deleted one
        if (selectedCourseId === courseId) {
          setSelectedCourseId(null);
          setCourse(null);
        }
        alert('Course deleted successfully');
        router.refresh(); // Refresh the page to update the course list
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };





  const addModule = async () => {
    console.log("This is the course in add module ", course);

    if (!course) {
      console.error("No course available to add module to");
      return;
    }

    console.log("This is the new module", newModule);

    const response = await fetch(`/api/courses/${course.id}/modules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newModule),
    });

    console.log("This is the response", newModule);
    if (response.ok) {
      const addedModule = await response.json();
      setCourse({
        ...course,
        modules: [...course.modules, addedModule],
      });
      setNewModule({
        title: "",
        videoURL: "",
        concepts: [""],
        objectives: [""],
        activities: [""],
      });
      setShowAddModule(false);
    } else {
      console.error("Failed to add module");
    }
  };

  const updateNewModule = (field: keyof Module, value: string | string[]) => {
    setNewModule({ ...newModule, [field]: value });
  };

  const addField = (field: "concepts" | "objectives" | "activities") => {
    setNewModule({
      ...newModule,
      [field]: [...newModule[field], ""],
    });
  };

  const updateField = (
    field: "concepts" | "objectives" | "activities",
    index: number,
    value: string
  ) => {
    const updatedField = [...newModule[field]];
    updatedField[index] = value;
    setNewModule({ ...newModule, [field]: updatedField });
  };


  return (
    <div className="main-container min-h-screen w-full flex flex-col items-start justify-start">
      <div className="videoContainer h-[500px] w-full">
        <Video
          src="https://teal-artistic-bonobo-612.mypinata.cloud/ipfs/QmaLGSyy1Q8hiiQh6hfBkUxLTQGsxoY18Ua3r2XsvAETWY"
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

      <div className="flex flex-col items-start justify-start gap-[10px] p-4 w-full">
        <h1 className="text-3xl font-bold">
          Welcome to Sydney Sanders Courses | Matrix Of Everything
        </h1>
        <div className="flex flex-row gap-[5px] items-center justify-center text-sm">
          <p>By Sydney Sanders | {address} </p>
          <p>Date: 09/24/2024</p>
        </div>

    

        {address === ADMINADDRESS && (
          <button
            onClick={() => setShowAddCourse(!showAddCourse)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Course
          </button>
        )}

        {showAddCourse && (
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              placeholder="Course Title"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              value={newCourse.author}
              onChange={(e) =>
                setNewCourse({ ...newCourse, author: e.target.value })
              }
              placeholder="Author"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="date"
              value={newCourse.date}
              onChange={(e) =>
                setNewCourse({ ...newCourse, date: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={addCourse}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Course
            </button>
          </div>
        )}


{selectedCourseId && (
        <button
          onClick={() => deleteCourse(selectedCourseId)}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Delete Selected Course
        </button>
      )}

        <button
          onClick={() => setShowAddModule(!showAddModule)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add An Module
        </button>

        {showAddModule && (
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Module</h2>
            <input
              type="text"
              value={newModule.videoURL}
              onChange={(e) => updateNewModule("videoURL", e.target.value)}
              placeholder="Video URL"
              className="w-full p-2 mb-4 border rounded"
            />

            <input
              type="text"
              value={newModule.title}
              onChange={(e) => updateNewModule("title", e.target.value)}
              placeholder="Module Title"
              className="w-full p-2 mb-4 border rounded"
            />
            {["concepts", "objectives", "activities"].map((field) => (
              <div key={field} className="mb-4">
                <h3 className="text-xl font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </h3>
                {(newModule[field as keyof Omit<Module, "id">] as string[]).map(
                  (item: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateField(
                          field as "concepts" | "objectives" | "activities",
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`${field.slice(0, -1)} ${index + 1}`}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  )
                )}
                <button
                  onClick={() =>
                    addField(field as "concepts" | "objectives" | "activities")
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add {field.slice(0, -1)}
                </button>
              </div>
            ))}
            <button
              onClick={addModule}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Module
            </button>
          </div>


        )}

<select onChange={(e) => handleCourseSelect(Number(e.target.value))}>
<option value="">Select a course</option>
          {Array.isArray(courses) &&
            courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
        </select>
<select onChange={(e) => setSelectedCourseId(Number(e.target.value))}>
<option value="">Edit an course</option>
          {Array.isArray(courses) &&
            courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
        </select>

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
        </div>
      </div>
    </div>
  );
}
