import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const states = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(states.LOADING);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  // Handle login API integration
  const getUserDetails = async (authcode) => {
    setError(null);
    setUserInfo(null);

    try {
      const endpoint = `http://localhost:8088/delegate/fetchUserInfo?code=${authcode}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setUserInfo(response.data);
      setStatus(states.LOADED);
    } catch (err) {
      setError({ errorCode: "", errormsg: err.message });
      setStatus(states.ERROR);
    }
  };

  useEffect(() => {
    const getQueryParams = async () => {
      let authcode = searchParams.get("code");
      let errorcode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");

      if (errorcode) {
        setError({
          errorCode: errorcode,
          errormsg: error_desc || "Authorization error",
        });
        setStatus(states.ERROR);
        return;
      }

      if (authcode) {
        getUserDetails(authcode);
      } else {
        setError({
          errorCode: "authcode_missing",
          errormsg: "Authorization code is missing",
        });
        setStatus(states.ERROR);
      }
    };

    getQueryParams();
  }, [searchParams]);

  return (
    <div>
      <div className="header">Welcome {userInfo?.name}</div>

      {status === states.LOADING && <div>Loading Please Wait...</div>}

      {status === states.LOADED && (
        <div>
          <div className="card">
            <img src={userInfo?.picture} alt="Profile" style={{ width: '100%' }} />
            <div className="color-black mt-5 mb-10">{userInfo?.email}</div>
            <div className="color-black mb-10">
              DoB: <span className="title color-black">{userInfo?.birthdate}</span>
            </div>
            <div className="color-black mb-10">
              Ph: <span className="title color-black">{userInfo?.phone_number}</span>
            </div>
          </div>
        </div>
      )}

      {status === states.ERROR && (
        <div>Oops, there is some error. Please try again later.</div>
      )}
    </div>
  );
};

export default UserProfile;
