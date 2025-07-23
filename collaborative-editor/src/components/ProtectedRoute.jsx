import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}
