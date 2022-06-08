import React, { useEffect } from "react";
import { useContractFunction, useEthers, useTokenBalance } from "@usedapp/core";
import { constants } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Token } from "./Main";
import { StakingRewardsTable } from "./StakingRewardsTable";
import { ConnectWallet } from "./ConnectWallet";
import { useContract, useTokenContract } from "../hooks/savvy_finance_farm";

function Actions(props: {
  token: Token;
  tokens: Token[];
  tokensAreUpdated: boolean;
}) {
  const { token, tokens, tokensAreUpdated } = props;
  const { account: walletAddress } = useEthers();
  const walletIsConnected = walletAddress !== undefined;

  const svfFarmContract = useContract();
  const { state: setStakingRewardTokenState, send: setStakingRewardTokenSend } =
    useContractFunction(svfFarmContract, "setStakingRewardToken", {
      transactionName: "Set Staking Reward Token",
    });

  const tokenContract = useTokenContract(token.address);
  const { state: tokenApproveState, send: tokenApproveSend } =
    useContractFunction(tokenContract, "approve", {
      transactionName: "Approve Token",
    });
  // const tokenApprove = (amount: string) =>
  //   tokenApproveSend(svfFarmContract.address, parseEther(amount));

  const [tabOption, setTabOption] = React.useState("stake");
  const handleChangeTabOption = (
    event: React.SyntheticEvent,
    newOption: string
  ) => {
    setTabOption(newOption);
  };

  const [tabAmount, setTabAmount] = React.useState("");
  const handleChangeTabAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTabAmount(event.target.value);
  };
  const handleMaxTabAmount = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (tabOption === "stake")
      setTabAmount(token.stakerData.walletBalance.toString());
    if (tabOption === "unstake")
      setTabAmount(token.stakerData.stakingBalance.toString());
    if (tabOption === "withdraw reward")
      setTabAmount(token.stakerData.rewardBalance.toString());
  };
  const handleClickTabButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (tabOption === "stake") console.log(tabOption);
    if (tabOption === "unstake") console.log(tabOption);
    if (tabOption === "withdraw reward") console.log(tabOption);
  };

  const [stakingRewardToken, setStakingRewardToken] = React.useState(
    token.stakerData.stakingRewardToken !== constants.AddressZero
      ? token.stakerData.stakingRewardToken
      : token.rewardToken
  );
  const handleChangeStakingRewardToken = (event: SelectChangeEvent) => {
    const rewardTokenAddress = event.target.value;
    setStakingRewardToken(rewardTokenAddress);

    const setStakingRewardTokenSendResult = () =>
      setStakingRewardTokenSend(token.address, rewardTokenAddress);

    console.log(setStakingRewardTokenSendResult());
  };
  useEffect(() => {
    if (tokensAreUpdated)
      setStakingRewardToken(
        token.stakerData.stakingRewardToken !== constants.AddressZero
          ? token.stakerData.stakingRewardToken
          : token.rewardToken
      );
  }, [tokensAreUpdated]);

  return (
    <Stack spacing={2.5}>
      <Box component={Paper}>
        <TabContext value={tabOption}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChangeTabOption}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Stake" value="stake" />
              <Tab label="Unstake" value="unstake" />
              <Tab label="Withdraw Reward" value="withdraw reward" />
            </TabList>
          </Box>
          <TabPanel value={tabOption}>
            <Typography variant="body2">
              Stake Fee: {token.stakeFee.toLocaleString("en-us")}%
            </Typography>
            <Typography variant="body2">
              Unstake Fee: {token.unstakeFee.toLocaleString("en-us")}%
            </Typography>
            <TextField
              label="Amount"
              type="number"
              margin="normal"
              value={tabAmount}
              onChange={handleChangeTabAmount}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleMaxTabAmount}>MAX</Button>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            {!walletIsConnected ? (
              <ConnectWallet />
            ) : (
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={handleClickTabButton}
              >
                {tabOption}
              </Button>
            )}
          </TabPanel>
        </TabContext>
      </Box>
      <Box component={Paper}>
        <Box px={2.5} py={1.5} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="button">Change Reward Token</Typography>
        </Box>
        <Box p={2.5}>
          {/* {!tokensAreUpdated ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : ( */}
          <FormControl fullWidth>
            <InputLabel>Reward Token</InputLabel>
            <Select
              label="Reward Token"
              value={stakingRewardToken}
              onChange={handleChangeStakingRewardToken}
            >
              {tokens.map((token) => (
                <MenuItem key={token.name} value={token.address}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* )} */}
        </Box>
      </Box>
    </Stack>
  );
}

export const TokenRowCollapse = (props: {
  token: Token;
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { token, tokens, tokensAreUpdated } = props;
  const { account: walletAddress } = useEthers();
  const walletIsConnected = walletAddress !== undefined;

  token.stakerData.walletBalance = parseFloat(
    formatEther(useTokenBalance(token.address, walletAddress) ?? 0)
  );

  return (
    <Box sx={{ margin: 1 }}>
      <Table size="small" aria-label="token row collapse">
        <TableBody>
          <TableRow sx={{ textAlign: "center", verticalAlign: "top" }}>
            <TableCell sx={{ maxWidth: "10rem" }}>
              <Stack spacing={2.5}>
                <Box component={Paper}>
                  <Box
                    px={2.5}
                    py={1.5}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <Typography variant="button">Your Balances</Typography>
                  </Box>
                  <Box p={2.5}>
                    <Typography variant="body2">
                      Wallet Balance:{" "}
                      {token.stakerData.walletBalance.toLocaleString("en-us")}{" "}
                      {token.name}
                    </Typography>
                    <Typography variant="body2">
                      Staking Balance:{" "}
                      {token.stakerData.stakingBalance.toLocaleString("en-us")}{" "}
                      {token.name}
                    </Typography>
                    <Typography variant="body2">
                      Reward Balance:{" "}
                      {token.stakerData.rewardBalance.toLocaleString("en-us")}{" "}
                      {token.name}
                    </Typography>
                  </Box>
                </Box>
                <Box component={Paper}>
                  <Box
                    px={2.5}
                    py={1.5}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <Typography variant="button">
                      Your Staking Rewards History
                    </Typography>
                  </Box>
                  <Box p={2.5}>
                    <StakingRewardsTable token={token} tokens={tokens} />
                  </Box>
                </Box>
                <Box display={{ xs: "block", sm: "none" }}>
                  <Actions
                    token={token}
                    tokens={tokens}
                    tokensAreUpdated={tokensAreUpdated}
                  />
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ maxWidth: "10rem" }}>
              <Box display={{ xs: "none", sm: "block" }}>
                <Actions
                  token={token}
                  tokens={tokens}
                  tokensAreUpdated={tokensAreUpdated}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
