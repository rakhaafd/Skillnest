import { BrowserRouter, Routes, Route } from "react-router-dom";
import Market from "./Pages/Market";
import DetailsItem from "./Fragments/DetailsItem";
import AddItem from "./Fragments/AddItem";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import EditItem from "./Fragments/EditItem";
import Profile from "./Pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Market />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/details/:id" element={<DetailsItem />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;