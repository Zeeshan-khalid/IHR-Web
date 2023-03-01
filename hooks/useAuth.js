import { useContext } from 'react';
import AuthContext from '../context/AuthContext/AuthProvider';

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context == null) throw new Error('Missing AuthProvider');
  return context;
}
export default useAuthContext;
