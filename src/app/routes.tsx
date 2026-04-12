import { createBrowserRouter } from "react-router";
import JoinPlanScreen from "./screens/JoinPlanScreen";
import AddSpecsScreen from "./screens/AddSpecsScreen";
import PlansHomeScreen from "./screens/PlansHomeScreen";
import ChoosePlanScreen from "./screens/ChoosePlanScreen";
import InfoPlanScreen from "./screens/InfoPlanScreen";
import ChatScreen from "./screens/ChatScreen";
import ChatInfoPlanScreen from "./screens/ChatInfoPlanScreen";
import PlanConfirmationScreen from "./screens/PlanConfirmationScreen";
import PlanRatingScreen from "./screens/PlanRatingScreen";
import PlanReviewsScreen from "./screens/PlanReviewsScreen";
import AddMemoriesScreen from "./screens/AddMemoriesScreen";
import RepeatVibeScreen from "./screens/RepeatVibeScreen";
import GroupsScreen from "./screens/GroupsScreen";
import DiaryScreen from "./screens/DiaryScreen";
import ProfileScreen from "./screens/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PlansHomeScreen,
  },
  {
    path: "/join-plan",
    Component: JoinPlanScreen,
  },
  {
    path: "/choose-plan",
    Component: ChoosePlanScreen,
  },
  {
    path: "/add-specs",
    Component: AddSpecsScreen,
  },
  {
    path: "/info-plan",
    Component: InfoPlanScreen,
  },
  {
    path: "/chat",
    Component: ChatScreen,
  },
  {
    path: "/groups",
    Component: GroupsScreen,
  },
  {
    path: "/diary",
    Component: DiaryScreen,
  },
  {
    path: "/chat-info",
    Component: ChatInfoPlanScreen,
  },
  {
    path: "/plan-confirmation",
    Component: PlanConfirmationScreen,
  },
  {
    path: "/plan-rating",
    Component: PlanRatingScreen,
  },
  {
    path: "/plan-reviews",
    Component: PlanReviewsScreen,
  },
  {
    path: "/add-memories",
    Component: AddMemoriesScreen,
  },
  {
    path: "/repeat-vibe",
    Component: RepeatVibeScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
]);
