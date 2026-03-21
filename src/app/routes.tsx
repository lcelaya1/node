import { createBrowserRouter } from "react-router";
import NoPlansScreen from "./screens/NoPlansScreen";
import JoinPlanScreen from "./screens/JoinPlanScreen";
import AddSpecsScreen from "./screens/AddSpecsScreen";
import PlansHomeScreen from "./screens/PlansHomeScreen";
import ChoosePlanScreen from "./screens/ChoosePlanScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: NoPlansScreen,
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
    path: "/plans-home",
    Component: PlansHomeScreen,
  },
]);
