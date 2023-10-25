// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import styles from './app.module.scss';
import { ToastContainer } from 'react-toastify';
import Login from '../page/login/login';
import { PrivateRoute } from '../utils/auth/private-route';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../component/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/auth';
import { AppDispatch } from '../store/store';
import { CircularProgress } from '@mui/material';
import { displayToast } from '../utils/toast/toast-service';
import { MessageState } from '../model/interface/message-state';
import { AuthState } from '../model/interface/auth-state';

export function App() {
  const { user: currentUser } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );
  const { isLoading } = useSelector(
    (state: { file: { isLoading: boolean } }) => state.file
  );
  const message = useSelector(
    (state: { message: MessageState }) => state.message
  );

  const dispatch = useDispatch<AppDispatch>();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    document.title = 'Login - Drive Clone';
    if (message.message) displayToast(message);
  }, [currentUser, logOut, message]);

  return (
    <div className="App">
      {isLoading ? (
        <CircularProgress
          color="secondary"
          style={{
            width: '10%',
            height: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 40,
            color: 'darkblue',
          }}
        />
      ) : null}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
    // <div>
    //   <NxWelcome title="drive-clone" />
    // </div>
  );
}

export default App;
