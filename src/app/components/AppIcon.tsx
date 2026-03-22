export type IconName =
  | "Add"
  | "Audio"
  | "BatteryFull"
  | "BatteryLow"
  | "BatteryMid"
  | "Bell"
  | "Calendar"
  | "Camera"
  | "Close"
  | "Comment"
  | "Done"
  | "Eye"
  | "Home"
  | "Info"
  | "Left"
  | "Like"
  | "Password"
  | "Search"
  | "SquarePen"
  | "User"
  | "Users";

type AppIconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

const icons: Record<IconName, React.ReactNode> = {
  Add: (
    <>
      <path d="M12 6L12 18" stroke="currentColor" strokeLinecap="round" />
      <path d="M18 12L6 12" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Audio: (
    <>
      <path d="M2 10V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3V21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 5V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 10V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  BatteryFull: (
    <>
      <rect x="7.5" y="6.5" width="9" height="14" rx="1.5" stroke="currentColor" />
      <rect x="9" y="8" width="6" height="11" rx="0.8" fill="currentColor" />
      <path d="M13 3C13.9428 3 14.4141 3.00008 14.707 3.29297C14.9999 3.58586 15 4.05719 15 5H9C9 4.05719 9.00008 3.58586 9.29297 3.29297C9.58586 3.00008 10.0572 3 11 3H13Z" fill="currentColor" />
    </>
  ),
  BatteryLow: (
    <>
      <rect x="7.5" y="6.5" width="9" height="14" rx="1.5" stroke="currentColor" />
      <rect x="9" y="16" width="6" height="3" rx="0.8" fill="currentColor" />
      <path d="M13 3C13.9428 3 14.4141 3.00008 14.707 3.29297C14.9999 3.58586 15 4.05719 15 5H9C9 4.05719 9.00008 3.58586 9.29297 3.29297C9.58586 3.00008 10.0572 3 11 3H13Z" fill="currentColor" />
    </>
  ),
  BatteryMid: (
    <>
      <rect x="7.5" y="6.5" width="9" height="14" rx="1.5" stroke="currentColor" />
      <rect x="9" y="12" width="6" height="7" rx="0.8" fill="currentColor" />
      <path d="M13 3C13.9428 3 14.4141 3.00008 14.707 3.29297C14.9999 3.58586 15 4.05719 15 5H9C9 4.05719 9.00008 3.58586 9.29297 3.29297C9.58586 3.00008 10.0572 3 11 3H13Z" fill="currentColor" />
    </>
  ),
  Bell: (
    <>
      <path d="M6.44784 8.96942C6.76219 6.14032 9.15349 4 12 4C14.8465 4 17.2378 6.14032 17.5522 8.96942L17.804 11.2356C17.8072 11.2645 17.8088 11.279 17.8104 11.2933C17.9394 12.4169 18.3051 13.5005 18.8836 14.4725C18.8909 14.4849 18.8984 14.4973 18.9133 14.5222L19.4914 15.4856C20.0159 16.3599 20.2782 16.797 20.2216 17.1559C20.1839 17.3946 20.061 17.6117 19.8757 17.7668C19.5971 18 19.0873 18 18.0678 18H5.93223C4.91268 18 4.40291 18 4.12434 17.7668C3.93897 17.6117 3.81609 17.3946 3.77841 17.1559C3.72179 16.797 3.98407 16.3599 4.50862 15.4856L5.08665 14.5222C5.10161 14.4973 5.10909 14.4849 5.11644 14.4725C5.69488 13.5005 6.06064 12.4169 6.18959 11.2933C6.19123 11.279 6.19283 11.2645 6.19604 11.2356L6.44784 8.96942Z" stroke="currentColor" />
      <path d="M9.10222 18.4059C9.27315 19.1501 9.64978 19.8077 10.1737 20.2767C10.6976 20.7458 11.3396 21 12 21C12.6604 21 13.3024 20.7458 13.8263 20.2767C14.3502 19.8077 14.7269 19.1501 14.8978 18.4059" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Calendar: (
    <>
      <path d="M19.5 9.5V8.7C19.5 7.57989 19.5 7.01984 19.282 6.59202C19.0903 6.21569 18.7843 5.90973 18.408 5.71799C17.9802 5.5 17.4201 5.5 16.3 5.5H7.7C6.5799 5.5 6.01984 5.5 5.59202 5.71799C5.21569 5.90973 4.90973 6.21569 4.71799 6.59202C4.5 7.01984 4.5 7.57989 4.5 8.7V9.5M19.5 9.5V16.3C19.5 17.4201 19.5 17.9802 19.282 18.408C19.0903 18.7843 18.7843 19.0903 18.408 19.282C17.9802 19.5 17.4201 19.5 16.3 19.5H7.7C6.57989 19.5 6.01984 19.5 5.59202 19.282C5.21569 19.0903 4.90973 18.7843 4.71799 18.408C4.5 17.9802 4.5 17.4201 4.5 16.3V9.5M19.5 9.5H4.5" stroke="currentColor" />
      <path d="M8.5 3.5L8.5 7.5M15.5 3.5L15.5 7.5" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Camera: (
    <>
      <path d="M22 18.3636C22 18.8458 21.8084 19.3083 21.4675 19.6493C21.1265 19.9903 20.664 20.1818 20.1818 20.1818H3.81818C3.33597 20.1818 2.87351 19.9903 2.53253 19.6493C2.19156 19.3083 2 18.8458 2 18.3636V8.36363C2 7.88142 2.19156 7.41896 2.53253 7.07798C2.87351 6.73701 3.33597 6.54545 3.81818 6.54545H7.45455L9.27273 3.81818H14.7273L16.5455 6.54545H20.1818C20.664 6.54545 21.1265 6.73701 21.4675 7.07798C21.8084 7.41896 22 7.88142 22 8.36363V18.3636Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16.5454C14.0083 16.5454 15.6364 14.9174 15.6364 12.9091C15.6364 10.9008 14.0083 9.27272 12 9.27272C9.99169 9.27272 8.36364 10.9008 8.36364 12.9091C8.36364 14.9174 9.99169 16.5454 12 16.5454Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Close: (
    <>
      <path d="M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Comment: (
    <path d="M11.5 20.4667C9.77272 20.4667 8.08422 19.9545 6.64803 18.9948C5.21184 18.0352 4.09247 16.6712 3.43146 15.0754C2.77046 13.4796 2.59751 11.7237 2.93448 10.0295C3.27146 8.33545 4.10323 6.77932 5.32461 5.55794C6.54599 4.33656 8.10212 3.50479 9.79622 3.16781C11.4903 2.83083 13.2463 3.00378 14.8421 3.66479C16.4379 4.32579 17.8019 5.44517 18.7615 6.88136C19.7211 8.31755 20.2333 10.006 20.2333 11.7333C20.2333 13.1772 19.884 14.5387 19.263 15.7381L20.2333 20.4667L15.5047 19.4963C14.3054 20.1173 12.943 20.4667 11.5 20.4667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Done: (
    <path d="M3 14.925L7.2 19.125L21.2 5.125" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Eye: (
    <path d="M10.73 5.073C11.1516 5.02419 11.5756 4.99982 12 5C16.664 5 20.4 7.903 22 12C20.4 16.097 16.664 19 12 19C7.336 19 3.6 16.097 2 12C3.6 7.903 7.336 5 12 5C12.4244 4.99982 12.8484 5.02419 13.27 5.073M9.88 9.88C9.6014 10.1586 9.3804 10.4893 9.22963 10.8534C9.07885 11.2174 9.00125 11.6075 9.00125 12.0015C9.00125 12.3955 9.07885 12.7856 9.22963 13.1496C9.3804 13.5137 9.6014 13.8444 9.88 14.123C10.1586 14.4016 10.4893 14.6226 10.8534 14.7734C11.2174 14.9242 11.6075 15.0018 12.0015 15.0018C12.3955 15.0018 12.7856 14.9242 13.1496 14.7734C13.5137 14.6226 13.8444 14.4016 14.123 14.123C14.4016 13.8444 14.6226 13.5137 14.7734 13.1496C14.9242 12.7856 15.0018 12.3955 15.0018 12.0015C15.0018 11.6075 14.9242 11.2174 14.7734 10.8534C14.6226 10.4893 14.4016 10.1586 14.123 9.88C13.8444 9.6014 13.5137 9.3804 13.1496 9.22963C12.7856 9.07885 12.3955 9.00125 12.0015 9.00125C11.6075 9.00125 11.2174 9.07885 10.8534 9.22963C10.4893 9.3804 10.1586 9.6014 9.88 9.88Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Home: (
    <>
      <path d="M5.5 9.61115C5.5 9.37295 5.5 9.25386 5.5501 9.15053C5.60021 9.0472 5.69372 8.97345 5.88075 8.82595L11.3807 4.48837C11.678 4.25398 11.8266 4.13678 12 4.13679C12.1734 4.13679 12.322 4.25398 12.6192 4.48838L18.1191 8.82595C18.3062 8.97345 18.3997 9.0472 18.4498 9.15053C18.4999 9.25386 18.4999 9.37295 18.4999 9.61114V18.5C18.4999 18.9714 18.4999 19.2071 18.3534 19.3536C18.207 19.5 17.9713 19.5 17.4999 19.5H6.5C6.0286 19.5 5.79289 19.5 5.64645 19.3536C5.5 19.2071 5.5 18.9714 5.5 18.5V9.61115Z" stroke="currentColor" />
      <path d="M14.5 19V14H9.5V19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Info: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <path d="M12 11V17" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Left: (
    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Like: (
    <path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.7431 9.0466 20.0978 6.92607C17.9877 4.20631 13.752 4.66243 12.2693 7.7691L12 8.33333L11.7307 7.7691C10.248 4.66243 6.01234 4.20631 3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="currentColor" strokeLinejoin="round" />
  ),
  Password: (
    <>
      <path d="M10.73 5.073C11.1516 5.02419 11.5756 4.99982 12 5C16.664 5 20.4 7.903 22 12C21.6126 12.9966 21.0893 13.9348 20.445 14.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12C3.6 16.097 7.336 19 12 19C13.9321 19.0102 15.8292 18.484 17.48 17.48M9.88 9.88C9.6014 10.1586 9.3804 10.4893 9.22963 10.8534C9.07885 11.2174 9.00125 11.6075 9.00125 12.0015C9.00125 12.3955 9.07885 12.7856 9.22963 13.1496C9.3804 13.5137 9.6014 13.8444 9.88 14.123C10.1586 14.4016 10.4893 14.6226 10.8534 14.7734C11.2174 14.9242 11.6075 15.0018 12.0015 15.0018C12.3955 15.0018 12.7856 14.9242 13.1496 14.7734C13.5137 14.6226 13.8444 14.4016 14.123 14.123" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4L20 20" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Search: (
    <>
      <circle cx="11" cy="11" r="6" stroke="currentColor" />
      <path d="M20 20L15.5 15.5" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  SquarePen: (
    <>
      <path
        d="M7 4.5H6.5C5.39543 4.5 4.5 5.39543 4.5 6.5V17.5C4.5 18.6046 5.39543 19.5 6.5 19.5H17.5C18.6046 19.5 19.5 18.6046 19.5 17.5V17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 5.25L18.75 9.75M10 18H6V14L15.9393 4.06066C16.5251 3.47487 17.4749 3.47487 18.0607 4.06066L19.9393 5.93934C20.5251 6.52513 20.5251 7.47487 19.9393 8.06066L10 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  User: (
    <>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeLinecap="round" />
      <path d="M4.84913 16.9479C5.48883 14.6034 7.91473 13.5 10.345 13.5H13.655C16.0853 13.5 18.5112 14.6034 19.1509 16.9479C19.282 17.4287 19.3868 17.9489 19.4462 18.5015C19.5052 19.0507 19.0523 19.5 18.5 19.5H5.5C4.94772 19.5 4.49482 19.0507 4.55382 18.5015C4.6132 17.9489 4.71796 17.4287 4.84913 16.9479Z" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  Users: (
    <>
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeLinecap="round" />
      <circle cx="16.5" cy="7" r="2.5" stroke="currentColor" strokeLinecap="round" />
      <path
        d="M4.5 18.5V17.75C4.5 15.9551 5.95508 14.5 7.75 14.5H10.25C12.0449 14.5 13.5 15.9551 13.5 17.75V18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 14.5H16.25C17.7688 14.5 19 15.7312 19 17.25V18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export function AppIcon({ name, className, size = 20 }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
