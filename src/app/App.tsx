import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-device">
        <div className="app-content">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}
