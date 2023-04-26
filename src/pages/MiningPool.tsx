import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import useCurrentTheme from '../consts/currentTheme';
import colors from '../consts/colors';
import { useEffect, useState } from 'react';
import {
  ContractVotePositiveJoin,
  ContractVoteNegativeJoin,
  ContractTryEnterPool,
  ContractAddPending,
} from '../consts/smartContractFunctions';
import { readOnlyAddressStatus, readOnlyGetRemainingBlocksJoin } from '../consts/readOnly';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Button from '@mui/material/Button';
import { userSession } from '../components/ConnectWallet';
import TableCreation from '../components/TableCreation';
import { WaitingData, waitingColumns, GetWaitingRows } from '../consts/tableData';

const MiningPool = () => {
  const { currentTheme } = useCurrentTheme();
  const [finalStatus, setFinalStatus] = useState<string>();
  const [blocksLeftUntilJoin, setBlocksLeftUntilJoin] = useState<any>();
  const waitingRows = GetWaitingRows();

  useEffect(() => {
    const fetchStatus = async () => {
      const args = userSession.loadUserData().profile.stxAddress.testnet;
      const status = await readOnlyAddressStatus(args);
      setFinalStatus(status);
    };
    fetchStatus();
  }, [setFinalStatus]);

  useEffect(() => {
    const fetchBlocksLeft = async () => {
      const blocksLeft = await readOnlyGetRemainingBlocksJoin();
      setBlocksLeftUntilJoin(Number(blocksLeft));
    };
    fetchBlocksLeft();
  }, [setBlocksLeftUntilJoin]);

  const tryEnterPool = () => {
    ContractTryEnterPool();
  };

  const addPendingToPool = () => {
    ContractAddPending();
  };

  const handleMinersVoteButtonClick = (data: string, address: string) => {
    if (data === 'voteYes') {
      ContractVotePositiveJoin(address);
    } else if (data === 'voteNo') {
      ContractVoteNegativeJoin(address);
    }
  };

  const waitingRowContent = (_index: number, waitingRow: WaitingData) => {
    return (
      <React.Fragment>
        {waitingColumns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.dataKey == 'address' ? 'left' : 'right'}
            sx={{
              color: colors[currentTheme].secondary,
            }}
          >
            {column.dataKey === 'vote' ? (
              <Box>
                <Button>
                  <ThumbUpAltIcon
                    fontSize="small"
                    sx={{ color: 'green' }}
                    onClick={() => handleMinersVoteButtonClick('voteYes', waitingRow['address'])}
                  />
                </Button>
                <Button style={{ marginRight: -52 }}>
                  <ThumbDownAltIcon
                    fontSize="small"
                    sx={{ color: 'red' }}
                    onClick={() => handleMinersVoteButtonClick('voteNo', waitingRow['address'])}
                  />
                </Button>
              </Box>
            ) : (
              waitingRow[column.dataKey]
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        minHeight: 'calc(100vh - 60px)',
      }}
      style={{
        backgroundColor: colors[currentTheme].accent2,
        color: colors[currentTheme].secondary,
      }}
    >
      Status: {finalStatus}
      {finalStatus === 'Waiting' && (
        <Button
          sx={{ border: 1 }}
          style={{
            backgroundColor: colors[currentTheme].accent2,
            color: colors[currentTheme].secondary,
            marginTop: 10,
            marginBottom: -10,
          }}
          onClick={() => tryEnterPool()}
        >
          Try Enter
        </Button>
      )}
      {(finalStatus === 'Pending' || finalStatus === 'Miner') && (
        <Box style={{ marginTop: 10, marginBottom: -10 }}>Blocks Left: {blocksLeftUntilJoin}</Box>
      )}
      {(finalStatus === 'Pending' || finalStatus === 'Miner') && blocksLeftUntilJoin == 0 && (
        <Button
          sx={{ border: 1 }}
          style={{
            backgroundColor: colors[currentTheme].accent2,
            color: colors[currentTheme].secondary,
            marginTop: 20,
            marginBottom: -10,
          }}
          onClick={() => addPendingToPool()}
        >
          Join Pool
        </Button>
      )}
      <TableCreation
        rows={waitingRows}
        rowContent={waitingRowContent}
        columns={waitingColumns}
        tableId="waiting"
        customTableWidth="75%"
      />
    </Box>
  );
};

export default MiningPool;

// done:
// STATUS: waiting
// ask to join
// table - waiting list
// voting waiting
// try-enter
// display current user STATUS
// modify contract name to "-5"
// // check if modular needed/different

// TODO:
// STATUS: pending
// read-only for pending
// table - pending list
// address, blocks-till can join get-data-miner-pending-accept
// blocks-till pass should be done separately

// button: check if enough blocks passed readOnly
// can-call-add-miners true/false
// button add-pending-miners-to-pool

// STATUS: miner
// table - miners list
// include

// GENERAL INFO
// Notifier: read only and displayed
// list of miners:
// number of blocks won: read only
// stacks rewards: read only

//
