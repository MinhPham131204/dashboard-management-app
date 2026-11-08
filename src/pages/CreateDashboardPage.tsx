import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/hooks';
import { createDashboard } from '../store/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import { useForm, UseFormRegister } from 'react-hook-form';
import ReactDOM from 'react-dom';

type FormValues = {
  users: number[];
  revenues: number[];
};

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

type FieldsetProps = {
  quarter: number;
  register: UseFormRegister<FormValues>;
};

const ShowModal = ({message, closeModal} : {message: string, closeModal: () => void}) => {
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <p className='text-xl'>{message}</p>
                <button className='bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 w-1/2 mx-auto' onClick={closeModal}>Đóng</button>
            </div>
        </div>,
        document.body,
    )
}

const Fieldset: React.FC<FieldsetProps> = ({ quarter, register }) => {
  return (
    <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
      <span className="font-semibold">{`Q${quarter + 1}:`}</span>
      <div>
        <div>
          <label htmlFor={`user${quarter}`}>Amount of users:</label>
          <input
            type="number"
            className="ml-2 border"
            id={`user${quarter}`}
            {...register(`users.${quarter}`, { required: true })}
          />
        </div>
        <div className="mt-3">
          <label htmlFor={`revenue${quarter}`}>Revenue:</label>
          <input
            type="number"
            className="ml-2 border"
            id={`revenue${quarter}`}
            {...register(`revenues.${quarter}`, { required: true })}
          />
        </div>
      </div>
    </fieldset>
  );
};

const CreateDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [handleClose, setHandleClose] = React.useState<() => void>(() => () => {});
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const url = `https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'],datasets:[{label:'Users',data:[${data.users.join(',')}]},{label:'Revenue',data:[${data.revenues.join(',')}]}]}}`;
    const res = await dispatch(createDashboard({ url }));
    if ((res as any).payload?.status === 201 || (res as any).payload?.status === 'created') {
      // const message = (res as any).payload?.message || 'Dashboard created successfully';
      // alert(`${message}`);
      // navigate('/dashboards');
      // return;
      setMessage('Dashboard created successfully');
      setIsOpen(true);
      setHandleClose(() => () => {
        setIsOpen(false);
        navigate('/dashboards');
      });
    }
    if((res as any).error) {
      const message = (res as any).error.message || 'Failed to create dashboard';
      setMessage(message);
      setIsOpen(true);
      setHandleClose(() => () => setIsOpen(false));
    }
  };

  console.log('CreateDashboardPage rendered');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-4 p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create new dashboard</h2>

      {quarters.map((quarter, index) => (
        <Fieldset key={quarter} quarter={index} register={register} />
      ))}

      <button type="submit" className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg">Create</button>
      {isOpen && <ShowModal message={message} closeModal={() => setIsOpen(false)} />}
    </form>
  );
};

export default CreateDashboardPage;