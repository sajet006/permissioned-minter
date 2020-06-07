import React, { Component } from 'react';
import { MetaMaskButton,Text, Flex} from 'rimble-ui';

class Header extends Component {
	render() {
		return (
			<header className="App-header">
				<div className="main-nav">
					<div>
						<a href="/">
							{' '}
							<Text
								style={{ fontWeight: 600, textAlign: 'center', marginBottom: '20px', fontSize: 23 }}
								fontFamily="sansSerif"
							>
								{' '}
								Permissioned Minting{' '}
							</Text>
						</a>
					</div>
				</div>
				<div />
				<Flex>				
					{this.props.account !== '0x0000000000000000000000000000000000000000' ? (
						<p style={{ color: 'white' }}>Connected Account: {this.props.account}</p>
					) : (
						<MetaMaskButton.Outline id="metamask-button" className="metamask" onClick={this.props.loadMetamask}>
							Connect with MetaMask
						</MetaMaskButton.Outline>
						
					)}
					
				</Flex>
			</header>
		);
	}
}

export default Header;
