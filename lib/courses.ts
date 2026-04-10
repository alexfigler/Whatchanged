import { supabaseAdmin, type Course, type Lesson } from "./supabase";

// --- Admin helpers (all courses/lessons, including unpublished) ---

export async function getAllCourses(): Promise<{
  data: Course[] | null;
  error: string | null;
}> {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data as Course[] | null, error: error?.message || null };
}

export async function getCourseById(
  courseId: string
): Promise<{ course: Course | null; lessons: Lesson[]; error: string | null }> {
  const [courseRes, lessonsRes] = await Promise.all([
    supabaseAdmin.from("courses").select("*").eq("id", courseId).single(),
    supabaseAdmin
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("day_number", { ascending: true }),
  ]);

  return {
    course: (courseRes.data as Course) || null,
    lessons: (lessonsRes.data as Lesson[]) || [],
    error: courseRes.error?.message || lessonsRes.error?.message || null,
  };
}

export async function getLessonById(
  lessonId: string
): Promise<{ lesson: Lesson | null; error: string | null }> {
  const { data, error } = await supabaseAdmin
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  return { lesson: (data as Lesson) || null, error: error?.message || null };
}

// --- Public helpers (published only) ---

export async function getPublishedCourse(
  slug: string
): Promise<{ course: Course | null; lessons: Lesson[]; error: string | null }> {
  const { data: course, error: courseErr } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (courseErr || !course) {
    return { course: null, lessons: [], error: courseErr?.message || null };
  }

  const { data: lessons, error: lessonsErr } = await supabaseAdmin
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("published", true)
    .order("day_number", { ascending: true });

  return {
    course: course as Course,
    lessons: (lessons as Lesson[]) || [],
    error: lessonsErr?.message || null,
  };
}
