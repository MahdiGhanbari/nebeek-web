export default function ({ store, redirect, route }) {
  if (!store.state.isLoggedIn) {
    return redirect('/user/login?r=' + route.fullPath)
  }
}
