import { createBrowserRouter } from "react-router";
import SplashScreen from "./screens/SplashScreen";
import NoPlansScreen from "./screens/NoPlansScreen";
import JoinPlanScreen from "./screens/JoinPlanScreen";
import CreatePlanScreen from "./screens/CreatePlanScreen";
import AddSpecsScreen from "./screens/AddSpecsScreen";
import PlansHomeScreen from "./screens/PlansHomeScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/home",
    Component: NoPlansScreen,
  },
  {
    path: "/join-plan",
    Component: JoinPlanScreen,
  },
  {
    path: "/create-plan",
    Component: CreatePlanScreen,
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
