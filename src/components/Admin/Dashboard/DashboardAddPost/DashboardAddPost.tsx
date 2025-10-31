import {
  faCloudUpload,
  faFile,
  faFileLines,
  faFlag,
  faImages,
  faLightbulb,
  faList,
  faListCheck,
  faPlay,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import ContentTypeSelector from "./ContentTypeSelector/ContentTypeSelector";
type NameType =
  | "Article"
  | "Gallery"
  | "Sorted List"
  | "Table of Contents"
  | "Video"
  | "Audio"
  | "Trivia Quiz"
  | "Personality Quiz"
  | "Poll"
  | "Recipe";

const contentTypes: ContentType[] = [
  {
    id: 1,
    name: "Article",
    icon: faFile,
    description: "An article with images and embed videos",
  },
  {
    id: 2,
    name: "Gallery",
    icon: faImages,
    description: "A collection of images",
  },
  {
    id: 3,
    name: "Sorted List",
    icon: faListCheck,
    description: "A list based article",
  },
  {
    id: 4,
    name: "Table of Contents",
    icon: faList,
    description: "List of links based on the headings",
  },
  {
    id: 5,
    name: "Video",
    icon: faCloudUpload,
    description: "Upload or embed videos",
  },
  {
    id: 6,
    name: "Audio",
    icon: faPlay,
    description: "Upload audios and create playlist",
  },
  {
    id: 7,
    name: "Trivia Quiz",
    icon: faFileLines,
    description: "Quizzes with right and wrong answers",
  },
  {
    id: 8,
    name: "Personality Quiz",
    icon: faUser,
    description: "Quizzes with custom results",
  },
  {
    id: 9,
    name: "Poll",
    icon: faFlag,
    description: "Get user opinions about something",
  },
  {
    id: 10,
    name: "Recipe",
    icon: faLightbulb,
    description: "A list of ingredients and directions for cooking",
  },
];

export interface ContentType {
  id: number;
  name: NameType;
  icon: IconDefinition;
  description: string;
}

export default function DashboardAddPost() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 ">
          Choose a Post Format
        </h2>
        <button className="flex items-center gap-2 text-sm bg-primary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
          <span className="material-icons-outlined text-lg">article</span> Posts
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contentTypes.map((type) => (
          <ContentTypeSelector key={type.id} type={type} />
        ))}
      </div>
    </div>
  );
}
