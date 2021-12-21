import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppPage } from '../../components/application/AppPage';
import { useFetch } from '../../hooks/use_fetch';
import { fetchJSON } from '../../utils/fetchers';

const AuthModalContainer = React.lazy(() => import(/* webpackChunkName: "Auth" */ '../AuthModalContainer')) // ../AuthModalContainer';
const NewPostModalContainer = React.lazy(() => import(/* webpackChunkName: "NewPost" */ '../NewPostModalContainer')) //'../NewPostModalContainer';
const NotFoundContainer = React.lazy(() => import(/* webpackChunkName: "NotFound" */ '../NotFoundContainer')) // '../NotFoundContainer';
const PostContainer = React.lazy(() => import(/* webpackChunkName: "Post" */ '../PostContainer')) // '../PostContainer';
const TermContainer = React.lazy(() => import(/* webpackChunkName: "Term" */ '../TermContainer')) // '../TermContainer';
const TimelineContainer = React.lazy(() => import(/* webpackChunkName: "Timeline" */ '../TimelineContainer')) // '../TimelineContainer';
const UserProfileContainer = React.lazy(() => import(/* webpackChunkName: "UserProfile" */ '../UserProfileContainer')) // '../UserProfileContainer';

/** @type {React.VFC} */
const AppContainer = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = React.useState(null);
  const { data, isLoading } = useFetch('/api/v1/me', fetchJSON);
  React.useEffect(() => {
    setActiveUser(data);
  }, [data]);

  const [modalType, setModalType] = React.useState('none');
  const handleRequestOpenAuthModal = React.useCallback(() => setModalType('auth'), []);
  const handleRequestOpenPostModal = React.useCallback(() => setModalType('post'), []);
  const handleRequestCloseModal = React.useCallback(() => setModalType('none'), []);
  
  return (
    <>
    {isLoading ? (
      <Helmet>
        <title>読込中 - CAwitter</title>
      </Helmet>
    ) : null}
      <AppPage
        activeUser={activeUser}
        onRequestOpenAuthModal={handleRequestOpenAuthModal}
        onRequestOpenPostModal={handleRequestOpenPostModal}
      >
        <Suspense fallback={<div>読込中・・・</div>}>
          <Routes>
              <Route element={<TimelineContainer />} path="/" />
              <Route element={<UserProfileContainer />} path="/users/:username" />
              <Route element={<PostContainer />} path="/posts/:postId" />
              <Route element={<TermContainer />} path="/terms" />
              <Route element={<NotFoundContainer />} path="*" />
          </Routes>
        </Suspense>
      </AppPage>

      {modalType === 'auth' ? (
        <AuthModalContainer onRequestCloseModal={handleRequestCloseModal} onUpdateActiveUser={setActiveUser} />
      ) : null}
      {modalType === 'post' ? <NewPostModalContainer onRequestCloseModal={handleRequestCloseModal} /> : null}
    </>
  );
};

export { AppContainer };

