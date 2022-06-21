import brownieConfig from "./brownie-config.json";

export const numberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  // maximumFractionDigits: 2,
});

// function secondsToYears(uint256 _seconds) public pure returns (uint256) {
//   return fromWei(_seconds * (0.0000000317098 * (10**18)));
// }

export const secondsToYears = (seconds: number): number => {
  return seconds * 0.0000000317098;
};

export const calculateStakingReward = (
  stakingApr: number,
  stakingValue: number,
  stakingTimestampLastRewarded: number
): number => {
  const stakingRewardRate = stakingApr / 100;
  const stakingTimestampStarted = stakingTimestampLastRewarded;
  const stakingTimestampEnded = Math.ceil(+new Date() / 1000);
  const stakingDurationInSeconds =
    stakingTimestampEnded - stakingTimestampStarted;
  const stakingDurationInYears = secondsToYears(stakingDurationInSeconds);
  const stakingRewardValue =
    stakingValue * stakingRewardRate * stakingDurationInYears;
  return stakingRewardValue;
};

export const getContractAddress = (
  contractName: string,
  networkName: string = "bsc-test"
): string => {
  return brownieConfig["networks"][networkName]["contracts"][contractName];
};
