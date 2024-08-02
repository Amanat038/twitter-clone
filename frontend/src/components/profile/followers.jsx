import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";

const Followers = () => {
   const { id } = useParams();
   const [data, setData] = useState({ user: null, followers: [] });

   useEffect(() => {
      axios
         .get(`${API_BASE_URL}/getme/${id}`)
         .then((response) => {
            setData(response.data);
         })
         .catch((error) => {
            console.error("Error fetching user:", error);
         });
   }, [id]);

   return (
      <div className="container mt-4">
         {data.user ? (
            <div>
               <div className="card mb-4">
                  <div className="card-body text-center">
                     <img
                        src={data.user.profileImg}
                        className="rounded-circle mb-3"
                        alt={data.user.name}
                        width="100"
                        height="100"
                     />
                     <h3 className="card-title">{data.user.name}</h3>
                     <p className="card-text">{data.user.email}</p>
                  </div>
               </div>
               <div>
                  <h2>Followers</h2>
                  <div className="row">
                     {data.user.followers.length > 0 ? (
                        data.user.followers.map((follower) => (
                           <div key={follower._id} className="col-md-4 mb-4">
                              <div className="card">
                                 <div className="card-body text-center">
                                    <img
                                       src={follower.profileImg}
                                       className="rounded-circle mb-3"
                                       alt={follower.name}
                                       width="50"
                                       height="50"
                                    />
                                    <h5 className="card-title">
                                       {follower.name}
                                    </h5>
                                    <p className="card-text">
                                       @{follower.username}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))
                     ) : (
                        <p>No followers found</p>
                     )}
                  </div>
               </div>
            </div>
         ) : (
            <p>Loading...</p>
         )}
      </div>
   );
};

export default Followers;
