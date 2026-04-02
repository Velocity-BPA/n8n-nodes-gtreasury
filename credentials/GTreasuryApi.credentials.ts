import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GTreasuryApi implements ICredentialType {
	name = 'gTreasuryApi';
	displayName = 'GTreasury API';
	documentationUrl = 'https://docs.gtreasury.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'OAuth 2.0 Client ID for GTreasury API',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'OAuth 2.0 Client Secret for GTreasury API',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.gtreasury.com/v1',
			required: true,
			description: 'Base URL for the GTreasury API',
		},
	];
}