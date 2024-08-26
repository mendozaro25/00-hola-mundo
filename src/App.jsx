import "./App.css";
import { HearderTwitter } from "./HearderTwitter";
import { TwitterFollewCard } from "./TwitterFollowCard";
import React, { useState, useEffect, useCallback } from "react";

const useFetchUsers = (url) => {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la respuesta de la red");
        const data = await response.json();
        setUsers(data.usuarios);
        setFollowers(data.followers);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { users, followers, isLoading, error, setUsers, setFollowers };
};

// const Alert = ({ message, onClose }) => {
//   if (!message) return null;

//   return (
//     <div className="alert top-right">
//       {message}
//       <button onClick={onClose} className="alert-close">
//         &times;
//       </button>
//     </div>
//   );
// };

export function App() {
  const { users, followers, isLoading, error, setUsers, setFollowers } =
    useFetchUsers("http://192.168.18.139:8081/api/react/usuario/listar");

  // const [alertMessage, setAlertMessage] = useState("");

  const handleUserUpdate = useCallback(
    async (userId, isFollowing) => {
      try {
        const response = await fetch(
          `http://192.168.18.139:8081/api/react/usuario/actualizar/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Id_empresa: "20600672631",
            },
            body: JSON.stringify({
              activo: !isFollowing,
            }),
          }
        );

        if (!response.ok) throw new Error("Error con el servidor");

        // const data = await response.json();
        // setAlertMessage(data.descripcion);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, activo: !isFollowing } : user
          )
        );

        setFollowers((prevFollowers) =>
          !isFollowing ? prevFollowers + 1 : prevFollowers - 1
        );
      } catch (error) {
        // setAlertMessage(error.message);
      }
    },
    [setFollowers, setUsers]
  );

  // const handleCloseAlert = () => setAlertMessage("");

  if (isLoading) return <div className="initializeApp">Cargando...</div>;

  if (error)
    return <div className="initializeApp">Sin conexión con el servidor</div>;

  return (
    <section className="App">
      {/* <Alert message={alertMessage} onClose={handleCloseAlert} /> */}
      <HearderTwitter followers={followers} />
      {users.map(({ id, username, imagen, name, activo }) => (
        <TwitterFollewCard
          key={id}
          userId={id}
          userName={username}
          initialIsFollowing={activo}
          routeImg={imagen}
          onUserUpdate={handleUserUpdate}
        >
          {name}
        </TwitterFollewCard>
      ))}
    </section>
  );
}
