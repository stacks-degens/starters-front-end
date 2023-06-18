import './styles.css';
import colors from '../../../consts/colorPallete';
import { useEffect, useState } from 'react';
import {
  ContractDelegateSTXStacking,
  ContractLeavePoolStacking,
  ContractRewardDistributionStacking,
} from '../../../consts/smartContractFunctions';
import { readOnlyClaimedBlockStatusStacking, readOnlyGetLiquidityProvider } from '../../../consts/readOnly';
import { useAppSelector } from '../../../redux/store';
import { selectCurrentTheme, selectUserSessionState } from '../../../redux/reducers/user-state';
import { Alert } from '@mui/material';
import { ElectricBolt } from '@mui/icons-material';

interface IActionsContainerStackingProps {
  userAddress: string | null;
}

const ActionsContainerProviderStacking = ({ userAddress }: IActionsContainerStackingProps) => {
  // const [withdrawAmountInput, setWithdrawAmountInput] = useState<number | null>(null);
  // const [totalWithdrawals, setTotalWithdrawals] = useState<number | null>(null);
  const [showAlertLeavePool, setShowAlertLeavePool] = useState<boolean>(false);
  const [leavePoolButtonClicked, setLeavePoolButtonClicked] = useState<boolean>(false);
  const [disableLeavePoolButton, setDisableLeavePoolButton] = useState<boolean>(false);
  const [delegateAmountInput, setDelegateAmountInput] = useState<number | null>(null);
  const [extendDelegateAmountInput, setExtendDelegateAmountInput] = useState<number | null>(null);
  const [claimRewardsInputAmount, setClaimRewardsInputAmount] = useState<number | null>(null);
  const [currentLiquidityProvider, setCurrentLiquidityProvider] = useState<string | null>(null);
  const appCurrentTheme = useAppSelector(selectCurrentTheme);

  const claimRewards = async () => {
    if (claimRewardsInputAmount !== null) {
      const wasBlockClaimed = await readOnlyClaimedBlockStatusStacking(claimRewardsInputAmount);
      if (wasBlockClaimed === false) {
        ContractRewardDistributionStacking(claimRewardsInputAmount);
      } else {
        alert('Block already claimed');
      }
    }
  };

  const delegateAmount = () => {
    if (delegateAmountInput !== null && !isNaN(delegateAmountInput)) {
      if (delegateAmountInput < 0.000001) {
        alert('You need to input more');
      } else {
        console.log(delegateAmountInput);
        if (userAddress !== null) {
          ContractDelegateSTXStacking(delegateAmountInput);
        }
      }
    }
  };

  const extendDelegateAmount = () => {
    if (extendDelegateAmountInput !== null && !isNaN(extendDelegateAmountInput)) {
      if (extendDelegateAmountInput < 0.000001) {
        alert('You need to input more');
      } else {
        console.log(extendDelegateAmountInput);
        if (userAddress !== null) {
          // ContractExtendDelegate(depositAmountInput, userAddress);
        }
      }
    }
  };

  useEffect(() => {
    const getCurrentLiquidityProvider = async () => {
      const liquidityProvider = await readOnlyGetLiquidityProvider();
      setCurrentLiquidityProvider(liquidityProvider);
    };

    getCurrentLiquidityProvider();
  }, [currentLiquidityProvider]);

  const leavePool = () => {
    setLeavePoolButtonClicked(true);
    if (currentLiquidityProvider !== null && currentLiquidityProvider !== userAddress) {
      console.log('test');
      ContractLeavePoolStacking();
    } else if (currentLiquidityProvider !== null && currentLiquidityProvider === userAddress) {
      console.log("you art the provider, you can't leave pool");

      setShowAlertLeavePool(true);
      setDisableLeavePoolButton(true);
    }
  };

  // useEffect(() => {
  //   const getUserTotalWithdrawls = async () => {
  //     const principalAddress = userSession.loadUserData().profile.stxAddress.testnet;
  //     const getTotalWithdrawals = await readOnlyGetAllTotalWithdrawalsMining(principalAddress);
  //     setTotalWithdrawals(getTotalWithdrawals);
  //   };

  //   getUserTotalWithdrawls();
  // }, [totalWithdrawals]);

  useEffect(() => {
    if (leavePoolButtonClicked && showAlertLeavePool) setDisableLeavePoolButton(true);
  }, [leavePoolButtonClicked, showAlertLeavePool]);

  return (
    <div>
      <div className="flex-container align-items-center input-line-actions-container">
        <div className="width-55 label-and-input-container-actions-container">
          <label className="custom-label">Insert amount of micro-STX</label>
          <div className="bottom-margins">
            <input
              className="custom-input"
              type="number"
              onChange={(e) => {
                // const inputAmount = e.target.value;
                // const inputAmountToInt = parseInt(inputAmount);
                // setDelegateAmountInput(inputAmountToInt);
                // console.log('deposit input', inputAmount);
              }}
            ></input>
          </div>
        </div>
        <div className="button-container-action-container">
          <button
            className={appCurrentTheme === 'light' ? 'customButton' : 'customDarkButton'}
            onClick={() => {
              delegateAmount();
            }}
          >
            Deposit
          </button>
        </div>
      </div>
      <div className="flex-container align-items-center input-line-actions-container">
        <div className="width-55 label-and-input-container-actions-container">
          <label className="custom-label">Insert amount of STX</label>
          <div className="bottom-margins">
            <input
              className="custom-input"
              type="number"
              onChange={(e) => {
                // const inputAmount = e.target.value;
                // const inputAmountToInt = parseFloat(inputAmount);
                // setExtendDelegateAmountInput(inputAmountToInt);
                // console.log('extend deposit input', inputAmount);
              }}
            ></input>
          </div>
        </div>
        <div className="button-container-action-container">
          <button
            className={appCurrentTheme === 'light' ? 'customButton' : 'customDarkButton'}
            onClick={extendDelegateAmount}
          >
            Lock in pool
          </button>
        </div>
      </div>
      <div
        id="revoke-delegate-button"
        className="content-sections-title-info-container leave-pool-button-action-container"
      >
        <div className="flex-center">
          <button
            className={appCurrentTheme === 'light' ? 'customButton' : 'customDarkButton'}
            // onClick={leavePool}

            disabled={disableLeavePoolButton}
          >
            Unlock extra STX locked
          </button>
        </div>
      </div>
      <div className="flex-container align-items-center input-line-actions-container">
        <div className="width-55 label-and-input-container-actions-container">
          <label className="custom-label">Insert your new btc address</label>
          <div className="bottom-margins">
            <input className="custom-input" type="text" onChange={() => {}}></input>
          </div>
        </div>
        <div className="button-container-action-container">
          <button
            className={appCurrentTheme === 'light' ? 'customButton' : 'customDarkButton'}
            // onClick={changeBtcAddress}
          >
            Set new provider
          </button>
        </div>
      </div>
      <div className="flex-container align-items-center input-line-actions-container">
        <div className="width-55 label-and-input-container-actions-container">
          <label className="custom-label">Insert your new btc address</label>
          <div className="bottom-margins">
            {/* <input className="custom-input" type="text" onChange={(e) => setBtcAddress(e.target.value)}></input> */}
            <input className="custom-input" type="text" onChange={() => {}}></input>
          </div>
        </div>
        <div className="button-container-action-container">
          <button
            className={appCurrentTheme === 'light' ? 'customButton' : 'customDarkButton'}
            // onClick={changeBtcAddress}
          >
            Set btc address pox rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionsContainerProviderStacking;
