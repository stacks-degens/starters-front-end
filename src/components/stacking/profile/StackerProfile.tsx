import { useState } from 'react';
import { selectCurrentUserRoleMining, selectUserSessionState } from '../../../redux/reducers/user-state';
import { useAppSelector } from '../../../redux/store';
import { principalCV, ClarityValue, listCV, cvToJSON } from '@stacks/transactions';
import './styles.css';
import RoleIntroStacking from './RoleIntroStacking';
import AboutContainerStacking from './AboutContainerStacking';
import ActionsContainerStacking from './ActionsContainerStacking';

interface IStackerProfileProps {
  currentRole: string;
  connectedWallet: string | null;
  explorerLink: string | undefined;
  userAddress: string | null;
}

const StackerProfile = ({ currentRole, connectedWallet, explorerLink, userAddress }: IStackerProfileProps) => {
  const userSession = useAppSelector(selectUserSessionState);
  const [totalWithdrawals, setTotalWithdrawals] = useState<number | null>(null);

  return (
    <div>
      <div className="principal-content-profile-page">
        <RoleIntroStacking currentRole={currentRole} />
        <div className={currentRole === 'Provider' ? 'main-info-container' : 'main-info-container-normal-user'}>
          <AboutContainerStacking
            currentRole={currentRole}
            connectedWallet={connectedWallet}
            explorerLink={explorerLink}
          />
          {currentRole === 'Provider' && <ActionsContainerStacking userAddress={userAddress} />}
        </div>
      </div>
    </div>
  );
};

export default StackerProfile;
