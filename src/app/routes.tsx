import { createBrowserRouter } from "react-router";
import JoinPlanScreen from "./screens/JoinPlanScreen";
import AddSpecsScreen from "./screens/AddSpecsScreen";
import PlansHomeScreen from "./screens/PlansHomeScreen";
import ChoosePlanScreen from "./screens/ChoosePlanScreen";
import InfoPlanScreen from "./screens/InfoPlanScreen";
import ChatScreen from "./screens/ChatScreen";
import ChatInfoPlanScreen from "./screens/ChatInfoPlanScreen";
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
    path: "/chat-info",
    Component: ChatInfoPlanScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
]);
