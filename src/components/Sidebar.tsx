import { Link, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/hooks';

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của Link
    dispatch(logout());
    navigate('/login'); // Chuyển hướng đến trang login
  };

  return (
    <Link to='/login' className='text-red-500' onClick={handleLogout}>
      Log Out
    </Link>
  );
};

export const Sidebar = () => {
  console.log("Sidebar rendered");

  return (
    <List className='text-white'>
      <ListItem>
        <Link to='/dashboards'>Dashboard</Link>
      </ListItem>
      <ListItem>
        <Link to='/dashboards/create'>Create Dashboard</Link>
      </ListItem>
      <ListItem>
        <Logout />
      </ListItem>
    </List>
  );
};