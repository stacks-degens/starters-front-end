import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectAction } from '../../../redux/actions';
import { selectCurrentUserRole, UserRole } from '../../../redux/reducers/user-state';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ContractAskToJoin } from '../../../consts/smartContractFunctions';
import { ReadOnlyGetMinersList, readOnlyGetNotifier } from '../../../consts/readOnly';

const Dashboard = () => {
  const [authenticatedSuccessfully, setAuthenticatedSuccessfully] = useState<boolean>(false);
  const [clickedJoinPoolButtonByViewer, setClickedJoinPoolButtonByViewer] = useState<boolean>(false);
  const [currentNotifier, setCurrentNotifier] = useState<string>();
  const [minersList, setMinersList] = useState<any>([]);
  const currentRole: UserRole = useAppSelector(selectCurrentUserRole);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authenticate = async () => {
    dispatch(connectAction());
  };

  const handleJoinPoolButtonByViewer = async () => {
    setClickedJoinPoolButtonByViewer(true);
    if (currentRole === 'Viewer') {
      try {
        await authenticate();
      } catch (error) {
        console.log('error trying to authenticate');
        console.log(error);
      }
    } // TODO: change navigate with the corresponding join pool function
    else if (currentRole === 'Miner') navigate('/myProfile');
  };

  const handleJoinPoolButtonByNormalUser = () => {
    alert('I am a normal user and now the join pool button should do something accordingly to my role');
    // TODO: change navigate with the corresponding join pool function as a normal user
  };

  useEffect(() => {
    const getCurrentNotifier = async () => {
      const notifier = await readOnlyGetNotifier();
      setCurrentNotifier(notifier);
    };

    getCurrentNotifier();
  }, [setCurrentNotifier]);

  useEffect(() => {
    const getMinersList = async () => {
      const { value } = await ReadOnlyGetMinersList();
      // console.log('current', value);
      const parsedMinersList = value.map((miner: any) => miner.value);
      // console.log('parsed', parsedMinersList);
      setMinersList(parsedMinersList);
    };

    getMinersList();
  }, [setMinersList]);

  useEffect(() => {
    if (currentRole === 'Viewer') {
      setAuthenticatedSuccessfully(false);
    } else {
      //TODO: if you are a miner, what should do this button? should it display leave pool?
      //if so, change the logic of this if block and the display condition of the Join Pool button
      setAuthenticatedSuccessfully(true);
      setClickedJoinPoolButtonByViewer(false);
    }
  }, [currentRole]);

  return (
    <div>
      <h2>Dashboard</h2>
      <h4>General info about Stacks - widgets/statistics</h4>
      <ul>
        <li>stacks rewards</li>
        <li>miners</li>
        <li>blocks</li>
      </ul>
      <h4>General info about mining pool</h4>
      <ul>
        <li>
          notifier: <div>{currentNotifier}</div>
        </li>
        <li>
          list of miners:
          {minersList.map((data: string) => (
            <div>{data}</div>
          ))}
        </li>
        <li>winner block id</li>
        <li>number of blocks won</li>
        <li>stacks rewards</li>
      </ul>
      {currentRole !== 'Miner' && !clickedJoinPoolButtonByViewer && (
        <Button
          variant="contained"
          onClick={() => {
            if (currentRole === 'Viewer') {
              handleJoinPoolButtonByViewer();
            } else if (currentRole === 'NormalUser' || 'Miner') {
              ContractAskToJoin('ST2ST2H80NP5C9SPR4ENJ1Z9CDM9PKAJVPYWPQZ50');
              handleJoinPoolButtonByNormalUser();
            }
          }}
        >
          Join pool
        </Button>
      )}
      {clickedJoinPoolButtonByViewer && authenticatedSuccessfully === false && (
        <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined">
          JOIN POOL
        </LoadingButton>
      )}
    </div>
  );
};

export default Dashboard;