import { BrowserRouter, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PostList from "./pages/PostList";
import Post from "./pages/Post";

import { AuthProvider } from "./contexts/AuthContext";

import "./App.css";

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="*" element={<NotFound />} />
            <Route index element={<Home />} />
          </Route>
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/admin" element={<DashboardLayout />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
