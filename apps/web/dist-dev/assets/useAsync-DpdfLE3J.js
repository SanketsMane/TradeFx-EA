import { d as reactExports } from "./index-DS595Jt3.js";
function useAsync(fn, deps = []) {
  const [state, setState] = reactExports.useState({ loading: true });
  const run = reactExports.useCallback(() => {
    setState((s) => ({ data: s.data, loading: true }));
    fn().then((data) => setState({ data, loading: false })).catch(
      (e) => setState({
        loading: false,
        error: e instanceof Error ? e.message : "Something went wrong"
      })
    );
  }, deps);
  reactExports.useEffect(() => {
    run();
  }, [run]);
  return { ...state, reload: run };
}
export {
  useAsync as u
};
