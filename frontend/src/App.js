import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Table, Tag, Space } from 'antd';
import Footer from './Footer';
import Header from './Header';
import PermissionedMintingInstance from './PermissionedMinting';
import Web3 from 'web3';
import NoMetamask from './NoMetamask';
import { Box, Card, Flex, Input,Button, ToastMessage,Text, Flash } from 'rimble-ui';
import { Warning } from '@rimble/icons';
import MediaQuery from 'react-responsive';

class App extends Component {
	state = {
		account: '0x0000000000000000000000000000000000000000',
		managerAddress: '0x00',
		getMintRequestsCount:0,
		MintingRequestList:[],
		tempMintersCount:0,
		enteredAddress: '0',
		enteredCheckingAddress:'0',
		enteredAmount:0,
		isTempMinter:false,
		removeTempMinter: false,
		addTempMinter: true,
		metamaskInstalled: false,
		requests: []
	};

	async componentDidMount() {
		// Detect Metamask
		const metamaskInstalled = typeof window.web3 !== 'undefined';
		this.setState({ metamaskInstalled });
		if (metamaskInstalled) {
			await this.loadWeb3();
			await this.loadBlockchainData();
		} else {
			console.log(this.state.metamaskInstalled);
		}
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3;
		// Load account
		const managerAddress = await PermissionedMintingInstance.methods.manager().call();
		const tempMintersCount = await PermissionedMintingInstance.methods.tempMintersCount().call();
		const getMintRequestsCount = await PermissionedMintingInstance.methods.getMintRequestsCount().call();
		const accounts = await web3.eth.getAccounts();
		this.setState({ tempMintersCount, managerAddress,getMintRequestsCount, account: accounts[0] });
		const networkId = await web3.eth.net.getId();
		if (networkId !== 42) {
			window.alert('PermissionedMinting contract not deployed to detected network.');
		}
		await this.generateRequestList();
	}

	AddTempMinter = async (event) => {

		event.preventDefault();
		window.toastProvider.addMessage('Processing...', {
			secondaryMessage: 'Check transaction details in your wallet',
			variant: 'processing'
		});
		await PermissionedMintingInstance.methods
			.addTempMinter(this.state.enteredAddress)
			.send({
				from: this.state.account
			})
			.on('transactionHash', function(hash) {
				window.toastProvider.addMessage('You have added Temporary Minter successfully', {
					secondaryMessage: 'Check transaction details in your wallet',
					actionHref: `https://kovan.etherscan.io/tx/${hash}`,
					actionText: 'View',
					variant: 'success'
				});
			});
		await this.loadBlockchainData();
	};

	RemoveTempMinter = async (event) => {

		event.preventDefault();
		window.toastProvider.addMessage('Processing...', {
			secondaryMessage: 'Check transaction details in your wallet',
			variant: 'processing'
		});
		await PermissionedMintingInstance.methods
			.removeTempMinter(this.state.enteredAddress)
			.send({
				from: this.state.account
			})
			.on('transactionHash', function(hash) {
				window.toastProvider.addMessage('You have removed the Temporary Minter successfully', {
					secondaryMessage: 'Check transaction details in your wallet',
					actionHref: `https://kovan.etherscan.io/tx/${hash}`,
					actionText: 'View',
					variant: 'success'
				});
			});
		await this.loadBlockchainData();
	};

	CreateMintRequest = async (event) => {

		event.preventDefault();
		window.toastProvider.addMessage('Processing...', {
			secondaryMessage: 'Check transaction details in your wallet',
			variant: 'processing'
		});
		await PermissionedMintingInstance.methods
			.createMintRequest(this.state.enteredAmount)
			.send({
				from: this.state.account
			})
			.on('transactionHash', function(hash) {
				window.toastProvider.addMessage('You have created Mint Request successfully', {
					secondaryMessage: 'Check transaction details in your wallet',
					actionHref: `https://kovan.etherscan.io/tx/${hash}`,
					actionText: 'View',
					variant: 'success'
				});
			});
		await this.loadBlockchainData();
	};

	FinaizeRequest = async (event) => {

		event.preventDefault();
		window.toastProvider.addMessage('Processing...', {
			secondaryMessage: 'Check transaction details in your wallet',
			variant: 'processing'
		});
		await PermissionedMintingInstance.methods
			.finalizeMintRequest(this.state.enteredAmount)
			.send({
				from: this.state.account
			})
			.on('transactionHash', function(hash) {
				window.toastProvider.addMessage('You have Finalized Mint Request successfully', {
					secondaryMessage: 'Check transaction details in your wallet',
					actionHref: `https://kovan.etherscan.io/tx/${hash}`,
					actionText: 'View',
					variant: 'success'
				});
			});
		await this.loadBlockchainData();
	};

	IsTempMinter= async (event) => {
		let isTempMinter=await PermissionedMintingInstance.methods
			.tempMinters(this.state.enteredCheckingAddress)
			.call()
		this.setState({ isTempMinter });
	};

	handleAddTempMinter() {
		if (!this.state.addTempMinter) {
			this.setState({ addTempMinter: !this.state.addTempMinter });
			this.setState({ removeTempMinter: !this.state.removeTempMinter });
		}
	}

	handleRemoveTempMinter() {
		if (this.state.addTempMinter) {
			this.setState({ removeTempMinter: !this.state.removeTempMinter });
			this.setState({ addTempMinter: !this.state.addTempMinter });
		}
	}

	async generateRequestList()
	{
		let mintRequestsCount=this.state.getMintRequestsCount;
		let MintingRequestList=[];
		let response={};
		let i=0;
		while(i < mintRequestsCount){
			response=await PermissionedMintingInstance.methods.mintrequests(i).call();
			MintingRequestList.push(response);
			i++;
		}
		this.setState({ MintingRequestList });
		let requests = []
		this.state.MintingRequestList.map(arrayElem => {
			requests.push(arrayElem)
		})
		this.setState({requests})
	};


	render() {
		// render appropriate toasts for processing/success transactions
		let message = <ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />;
		const columns = [
			{
			title: 'Request Index',
			dataIndex: 'key',
			key: 'key',
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				key: 'amount',
			},
			{
			title: 'Address',
			dataIndex: '1',
			key: 'address',
			render: text => <a href={`https://kovan.etherscan.io/address/${text}`}>{text}</a>
			},
			{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render:
				status => {
					let detailStatus;
					let color;
					if (status === '0') {
					color = 'volcano';
					detailStatus="DECLINED";
					}
					else if(status === '1') {
						color = 'orange';
						detailStatus="PENDING"
					}
					else{
						color = 'green';
						detailStatus="APPROVED";
					}
					return (
					<Tag color={color} key={detailStatus}>
						{detailStatus}
					</Tag>
					);
				}
	
			},
			{
			title: 'Finalize Request',
			key: 'finalize',
			render: (text, record) => (
				<Space size="middle">
					<Button variant="success" >Approve</Button>
					<Button variant="danger" >Decline</Button>
				</Space>
			),
			},
		];
		
		// let requests = [
		// 	{
		// 	key: '0',
		// 	index: '0',
		// 	amount: 32,
		// 	address: '0xf13f977aac9b001f155889b9efa7a6628fb7a181',
		// 	status: ["Pending"],
		// 	},
		// 	{
		// 	key: '1',
		// 	index: '1',
		// 	amount: 42,
		// 	address: '0xf13f977aac9b001f155889b9efa7a6628fb7a181',
		// 	status: ["Pending"],
		// 	},
		// 	{
		// 	key: '2',
		// 	index: '2',
		// 	amount: 32,
		// 	address: '0xf13f977aac9b001f155889b9efa7a6628fb7a181',
		// 	status: ["Pending"],
		// 	}
		// ];

		// render buttons
		let tempMinterButton;
		if (this.state.enteredAddress!=='0' && (this.state.enteredAddress).length===42) {
			if (this.state.addTempMinter) {
				tempMinterButton = (
					<div>
						<ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />
						<Button style={{ marginTop: '2px', marginLeft: '72px' }} onClick={(e) => this.AddTempMinter(e)}>
							Add TempMinter
						</Button>
					</div>
				);
			} 
			else {
				tempMinterButton = (
					<Button style={{ marginTop: '2px', marginLeft: '72px' }} onClick={this.RemoveTempMinter}>
						Remove TempMinter
					</Button>
				);
			}
		} 
		else {
			tempMinterButton = (
				<Button style={{ marginTop: '2px', marginLeft: '72px' }} disabled>
					Modify TempMinter
				</Button>
			);
		}

		// render buttons
		let isTempMinterButton;
		if (this.state.enteredCheckingAddress!=='0' && (this.state.enteredCheckingAddress).length===42) {
			
				isTempMinterButton = (
					<div>
						<ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />
						<Button style={{ marginTop: '2px', marginLeft: '72px' }} onClick={(e) => this.IsTempMinter(e)}>
							Check
						</Button>
					</div>
				);
		} 
		else {
			isTempMinterButton = (
				<Button style={{ marginTop: '2px', marginLeft: '72px' }} disabled>
					Check
				</Button>
			);
		}

		let createRequestButton;
		if (Number(this.state.enteredAmount) !== 0) {
				createRequestButton = (
					<div>
						<ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />
						<Button style={{ marginTop: '2px', marginLeft: '72px' }} onClick={(e) => this.CreateMintRequest(e)}>
							Create Request
						</Button>
					</div>
				);
		} else {
			createRequestButton = (
				<Button style={{ marginTop: '2px', marginLeft: '72px' }} disabled>
					Create Request
				</Button>
			);
		}

		return (
			<div className="App">
				<Header account={this.state.account} loadMetamask={this.loadWeb3}/>
				<div className="purple-bar" />
				<Flash className="info" variant="info" style={{ textAlign: 'center', marginTop: '0px' }}>
					{' '}
					<Text>Contract Manager Address: <b>{this.state.managerAddress}</b></Text>
				</Flash>
				<MediaQuery maxDeviceWidth={1000}>
					<Flash variant="danger" className="info-mobile" style={{ textAlign: 'center', marginTop: '0px' }}>
						{' '}
						<Warning />
						<Text>
							Your browser doesn't support our blockchain features, try a mobile browser like Status,
							Coinbase Wallet or Cipher
						</Text>
					</Flash>
				</MediaQuery>
				{message}
				{!this.state.metamaskInstalled ? 
					(<NoMetamask />) : 
					(
						<div>
							<div className="content">
								<Box
									className="rectangle-card"
									bg="white"
									color="#4E3FCE"
									fontSize={4}
									p={3}
									style={{
										height: '147px',
										width: '70%',
										marginTop: '5.3%',
										border: '1px solid #D6D6D6',
										boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
									}}
									width={[ 1, 1, 0.5 ]}
								>
									<div className="box-contents">
										<div>
											<Text style={{ fontWeight: 600, marginRight: '30px' }} fontFamily="sansSerif">
												<p>Total Mint Requests</p>
											</Text>
											<Text style={{ color: 'black', fontSize: '17px' }}>
												<b>{this.state.getMintRequestsCount}</b>
											</Text>
										</div>
						
										<div>
											<Text style={{ fontWeight: 600, marginRight: '30px' }} fontFamily="sansSerif">
												<p>Total Temporary Minters</p>
											</Text>

											<Text style={{ color: 'black', fontSize: '17px', marginLeft: '55px' }}>
												<b>{this.state.tempMintersCount}</b>
											</Text>
										</div>
									</div>
								</Box>
								<Flex style={{ marginTop: '20px' }}>
									<div className="conversion-card">
										<div className="toggle-buttons">
											<Button.Outline
												className={
													this.state.addTempMinter ? 'buttonAddTempMinter-blue' : 'buttonAddTempMinter'
												}
												onClick={this.handleAddTempMinter.bind(this)}
												style={{ maxWidth: '175px' }}
											>
												Add Temp Minter
											</Button.Outline>
											<Button.Outline
												className={
													this.state.removeTempMinter ? 'buttonRemoveTempMinter-blue' : 'buttonAddTempMinter'
												}
												onClick={this.handleRemoveTempMinter.bind(this)}
												style={{ width: '184px' }}
											>
												Remove Temp Minter
											</Button.Outline>
										</div>
										<Card
											bg="white"
											color="#4E3FCE"
											style={{
												border: '1px solid #D6D6D6',
												boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
												marginRight: '50px'
											}}
											maxWidth={'350px'}
											maxHeight={'350px'}
										>
											<span style={{ color: 'black', fontSize: '13px' }}>
												{' '}
												<b>
													{' '}
													{`Contract Manager can ${this.state.addTempMinter
														? 'Add a new Temporary Minter'
														: 'Remove an existing Temporary Minter'}`}{' '}
												</b>
											</span>
											<div style={{ marginTop: '30px' }}>
												<span
													className=""
													style={{ textAlign: 'left', color: 'black', fontSize: '12px' }}
												>
													{`Address of ${this.state.addTempMinter ? 'New Minter' : 'Existing Minter'}`}{' '}
												</span>
											</div>
											<Input
												style={{ marginBottom: '15px', width: '280px' }}
												type="text"
												required={true}
												placeholder="Enter Address 0x123"
												enteredAddress={this.state.enteredAddress}
												onChange={(event) =>
													this.setState({enteredAddress: event.target.value})}
											/>
											{tempMinterButton}
										</Card>
									</div>
										<Card
											bg="white"
											color="#4E3FCE"
											style={{
												border: '1px solid #D6D6D6',
												boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
												marginRight: '50px'
											}}
											maxWidth={'350px'}
											maxHeight={'350px'}
										>
											<div >
												<Text
													style={{ fontWeight: 600, textAlign: 'center', marginBottom: '10px' }}
													fontFamily="sansSerif"
												>
													Create Token Minting Request
												</Text>
											</div>
											<Input
												style={{ marginBottom: '15px', width: '280px' }}
												type="number"
												required={true}
												placeholder="Enter Token Amount"
												enteredAmount={this.state.enteredAmount}
												onChange={(event) =>
													this.setState({enteredAmount: event.target.value})}
											/>
											{createRequestButton}
										</Card>
										<Card
											bg="white"
											color="#4E3FCE"
											style={{
												border: '1px solid #D6D6D6',
												boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
												marginRight: '50px'
											}}
											maxWidth={'350px'}
											maxHeight={'350px'}
										>
											
												<Text
													style={{ fontWeight: 600, textAlign: 'center', marginBottom: '10px' }}
													fontFamily="sansSerif"
												>
													Check Is Temporary Minter
												</Text>
											
											<Input
												style={{ marginBottom: '15px', width: '280px' }}
												type="text"
												required={true}
												placeholder="Enter Address 0x123"
												enteredCheckingAddress={this.state.enteredCheckingAddress}
												onChange={(event) =>
													this.setState({enteredCheckingAddress: event.target.value})}
											/>
											{isTempMinterButton}
											<Text
													style={{ fontWeight: 300, textAlign: 'center', marginBottom: '10px' }}
													fontFamily="sansSerif"
											>
												Status : {(this.state.isTempMinter).toString()}
											</Text>
										</Card>
									
									</Flex>
								<Table dataSource={this.state.requests} columns={columns} />
							</div>
						</div>
					)
				}
				<Footer/>
			</div>
		);
	}
}

export default App;
