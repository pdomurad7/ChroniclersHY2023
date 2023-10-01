import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import _ from 'lodash';
import {
	InputLabel,
	Select,
	MenuItem,
	Paper,
	Typography,
	Button,
	Box,
	TextField,
	Grid,
	Autocomplete,
	Card,
	CardContent,
	CardActions,
} from '@mui/material';
import { useQuery } from 'react-query';
import { getChiefNames, getCryptoCurrencies, postReport } from './api';

const labels = {
	enforcementAuthority: {
		name: 'enforcementAuthority',
		label: 'Nazwa organu egzekucyjnego',
	},
	caseNumber: {
		name: 'caseNumber',
		label: 'Numer sprawy',
	},
	ownerData: {
		name: 'ownerData',
		label: 'Dane identyfikujące właściciela kryptoaktywa',
	},
	cryptoCurrencyName: {
		name: 'cryptoCurrencyName',
		label: 'Nazwa kryptoaktywa',
	},
	cryptoCurrencyAmount: {
		name: 'cryptoCurrencyAmount',
		label: 'Ilość',
	},
};

const cryptoCurrencyDataLabels: any = {
	cryptoCurrencyName: {
		name: 'cryptocurrencyName',
		label: 'Nazwa kryptoaktywa',
	},
	cryptoCurrencyAmount: {
		name: 'cryptocurrencyAmount',
		label: 'Ilość',
	},
};

const cryptoCurrencySourceLabelsDefault: any = {
	url: {
		name: 'url',
		label: 'Adres strony giełdy/kantoru',
	},
	name: {
		name: 'name',
		label: 'Nazwa giełdy/kantoru',
	},
	cryptoRate: {
		name: 'cryptoRate',
		label: 'Kurs kryptoaktywa',
	},
	currency: {
		name: 'currency',
		label: 'Waluta',
	},
};

type CryptoCurrencyData = {
	cryptoCurrencyName: string;
	cryptoCurrencyAmount: number;
};

type CryptoCurrencySource = {
	exchangeUrl: string;
	exchangeName: string;
	cryptoRate: number;
	currency: string;
};

const DataForm = () => {
	const {
		control,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			enforcementAuthority: '',
			caseNumber: '',
			ownerData: '',
		},
		mode: 'onChange',
	});

	const watchedFields = watch();

	const { data: chiefNames } = useQuery('chiefNames', getChiefNames);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1em',
			}}
		>
			<Typography variant='h5'>Dane podstawowe</Typography>
			<Controller
				name='enforcementAuthority'
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						label={labels.enforcementAuthority.label}
						id='enforcementAuthority-label'
					>
						{chiefNames?.map((name: any, index: any) => (
							<MenuItem key={index} value={name}>
				c			{name}
							</MenuItem>
						))}
					</Select>
				)}
			/>
			<Controller
				name='caseNumber'
				control={control}
				rules={{
					required: 'Pole wymagane',
					maxLength: {
						value: 100,
						message: 'Maksymalna długość to 100 znaków',
					},
					pattern: {
						value: /^[A-Za-z0-9./-]+$/,
						message:
							'Poprawny format powinien zawierać tylko litery, cyfry, znaki ".", "-" oraz "/"',
					},
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label={labels.caseNumber.label}
						variant='outlined'
						error={Boolean(errors.caseNumber)}
						helperText={errors.caseNumber?.message}
						fullWidth
					/>
				)}
			/>

			<Controller
				name='ownerData'
				control={control}
				rules={{
					required: 'Pole wymagane',
					maxLength: {
						value: 100,
						message: 'Maksymalna długość to 100 znaków',
					},
					pattern: {
						value: /^[A-Za-z0-9.-]+$/,
						message:
							'Poprawny format powinien zawierać tylko litery, cyfry oraz znaki "-", "."',
					},
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label={labels.ownerData.label}
						error={Boolean(errors.ownerData)}
						helperText={errors.ownerData?.message}
						variant='outlined'
						fullWidth
					/>
				)}
			/>
		</Box>
	);
};

const useDataList = (keyData: string) => {
	const reportContext = React.useContext(ReportContext);
	const [dataList, setDataList] = React.useState<any[]>([]);

	const onAppend = (data: any) => {
		const updatedData = [...dataList, data];
		setDataList(updatedData);
		reportContext.setReport((prevValue: any) => ({
			...prevValue,
			[keyData]: updatedData,
		}));
	};

	const onRemove = (index: number) => {
		const newList = dataList.filter((_, i) => i !== index);
		setDataList(newList);
		reportContext.setReport((prevValue: any) => ({
			...prevValue,
			[keyData]: newList,
		}));
	};

	return { dataList, onAppend, onRemove };
};

export const CryptoCurrencyDataForm = ({ onAppend }: any) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { data: cryptoCurrencyData, isLoading } = useQuery(
		'cryptoCurrencyData',
		getCryptoCurrencies
	);

	const cryptoCurrencyOptions = cryptoCurrencyData?.map(
		(cryptoCurrency: any) =>
			`${cryptoCurrency.name} (${cryptoCurrency.code})`
	);

	if (isLoading) {
		return <div>Ładowanie...</div>;
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
			<Typography variant='h5'>Dodaj nowe kryptoaktywa</Typography>
			<Box
				component='form'
				sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
				onSubmit={handleSubmit(onAppend)}
			>
				<Controller
					name={labels.cryptoCurrencyName.name}
					control={control}
					defaultValue={null}
					rules={{
						required: 'Pole wymagane',
					}}
					render={({ field }) => (
						<Autocomplete
							{...field}
							fullWidth
							options={cryptoCurrencyOptions}
							onChange={(_, data) => field.onChange(data)}
							renderInput={(params) => (
								<TextField
									{...params}
									error={Boolean(errors.cryptoCurrencyName)}
									label={labels.cryptoCurrencyName.label}
								/>
							)}
						/>
					)}
				/>
				<Controller
					name={labels.cryptoCurrencyAmount.name}
					control={control}
					defaultValue={0}
					rules={{
						required: 'Pole wymagane',
						validate: {
							isFloat: (value) => {
								const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
								return (
									floatRegex.test(value) || 'Must be a float'
								);
							},
						},
					}}
					render={({ field }) => (
						<TextField
							{...field}
							label={labels.cryptoCurrencyAmount.label}
							error={Boolean(errors.cryptoCurrencyAmount)}
							fullWidth
						/>
					)}
				/>
				<Button variant='contained' type='submit'>
					Dodaj
				</Button>
			</Box>
		</Box>
	);
};

export const CryptoCurrencyWrapper = () => {
	const { dataList, onAppend, onRemove } = useDataList(
		'cryptocurrenciesAmount'
	);

	return (
		<Box sx={{ display: 'flex', gap: '2em' }}>
			<CryptoCurrencyDataForm onAppend={onAppend} />
			<Box
				sx={{
					overflowY: 'auto',
					maxHeight: '400px',
					width: '500px',
					flex: 1,
				}}
			>
				<Grid container spacing={2}>
					{dataList.map((cryptoCurrencyData, index) => {
						const labelValues = Object.keys(cryptoCurrencyData).map(
							(key: string) => ({
								label: cryptoCurrencyDataLabels[key].label,
								value: cryptoCurrencyData[key],
							})
						);
						return (
							<Grid item xs={6} key={index}>
								<Record
									index={index}
									labelValues={labelValues}
									onRemove={onRemove}
								/>
							</Grid>
						);
					})}
				</Grid>
			</Box>
		</Box>
	);
};

export const Record: React.FC<any> = ({
	index,
	labelValues,
	onRemove,
}: any) => {
	return (
		<Card variant='outlined'>
			<CardContent>
				<Box display='flex' flexDirection='column'>
					{labelValues.map((lv: any, i: any) => (
						<Box key={i}>
							<InputLabel>{lv.label}</InputLabel>
							<Typography variant='body2'>{lv.value}</Typography>
						</Box>
					))}
				</Box>
			</CardContent>
			<CardActions>
				<Button onClick={() => onRemove(index)}>Usuń</Button>
			</CardActions>
		</Card>
	);
};

export const CryptoCurrencySourceForm = ({ onAppend }: any) => {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();
	const { data: cryptoCurrencyData } = useQuery(
		'cryptoCurrencyData',
		getCryptoCurrencies
	);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1em',
			}}
		>
			<Typography variant='h5'>
				Dodaj źródło kursu kryptoaktywa
			</Typography>
			<Box
				component='form'
				sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
				onSubmit={handleSubmit(onAppend)}
			>
				<Controller
					name={cryptoCurrencySourceLabelsDefault.url.name}
					control={control}
					rules={{
						required: 'Pole wymagane',
						pattern: {
							value: /^(http|https):\/\/[^ "]+$/,
							message: 'Niepoprawny format adresu URL',
						},
					}}
					defaultValue=''
					render={({ field }) => (
						<TextField
							label='Adres strony giełdy/kantoru'
							variant='outlined'
							error={Boolean(errors.exchangeUrl)}
							helperText={errors.exchangeUrl?.message}
							fullWidth
							{...field}
						/>
					)}
				/>
				<Controller
					name={cryptoCurrencySourceLabelsDefault.name.name}
					control={control}
					defaultValue=''
					rules={{
						required: 'Pole wymagane',
					}}
					render={({ field }) => (
						<TextField
							label='Nazwa giełdy/kantoru'
							error={Boolean(errors.name)}
							helperText={errors.name?.message}
							variant='outlined'
							fullWidth
							{...field}
						/>
					)}
				/>
				{cryptoCurrencyData?.length > 0 &&
					cryptoCurrencyData.map((crypto: any, index: any) => {
						return (
							<Box key={index}>
								<Controller
									name={`${crypto.code}`}
									control={control}
									rules={{
										required: 'Pole wymagane',
									}}
									defaultValue=''
									render={({ field }) => (
										<TextField
											error={Boolean(errors.cryptoRate)}
											label={`Kurs ${crypto.code}`}
											helperText={
												errors.cryptoRate?.message
											}
											variant='outlined'
											{...field}
										/>
									)}
								/>
								<Controller
									name={`${crypto.code}Currency`}
									control={control}
									defaultValue='PLN'
									render={({ field }) => (
										<Select
											{...field}
											sx={{ minWidth: 100 }}
										>
											<MenuItem value='PLN'>PLN</MenuItem>
											<MenuItem value='USD'>USD</MenuItem>
										</Select>
									)}
								/>
							</Box>
						);
					})}
				<Button variant='contained' type='submit'>
					Dodaj
				</Button>
			</Box>
		</Box>
	);
};

const CryptoCurrencySourceWrapper = () => {
	const { dataList, onAppend, onRemove } = useDataList(
		'cryptocurrencyManualRates'
	);
	const { data: cryptoCurrencyData } = useQuery(
		'cryptoCurrencyData',
		getCryptoCurrencies
	);

	const [cryptoCurrencySourceLabels, setCryptoCurrencySourceLabels] =
		React.useState(cryptoCurrencySourceLabelsDefault);

	React.useEffect(() => {
		if (cryptoCurrencyData?.length > 0) {
			const newLabels = cryptoCurrencyData.reduce(
				(acc: any, crypto: any) => {
					return {
						...acc,
						[crypto.code]: {
							name: crypto.code,
							label: `Kurs ${crypto.code}`,
						},
						[`${crypto.code}Currency`]: {
							name: `${crypto.code}Currency`,
							label: 'Waluta',
						},
					};
				},
				{}
			);
			setCryptoCurrencySourceLabels({
				...cryptoCurrencySourceLabels,
				...newLabels,
			});
		}
	}, [cryptoCurrencyData]);

	return (
		<Box sx={{ display: 'flex', gap: '2em' }}>
			<CryptoCurrencySourceForm onAppend={onAppend} />
			<Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
				<Grid container spacing={2}>
					{dataList.map((cryptoCurrencySource, index) => {
						console.log(dataList, cryptoCurrencySourceLabels);
						const labelValues = Object.keys(
							cryptoCurrencySource
						).map((key: string) => ({
							label: cryptoCurrencySourceLabels[key].label,
							value: cryptoCurrencySource[key],
						}));

						return (
							<Grid item xs={12} key={index}>
								<Record
									labelValues={labelValues}
									cryptoCurrencySource={cryptoCurrencySource}
									key={index}
									index={index}
									onRemove={onRemove}
								/>
							</Grid>
						);
					})}
				</Grid>
			</Box>
		</Box>
	);
};

export const ReportPreview = () => {
	const reportContext = React.useContext(ReportContext);
	console.log(reportContext);

	const formattedCryptoCurrenciesAmount =
		reportContext?.report?.cryptocurrenciesAmount?.map((crypto: any) => ({
			name: crypto.cryptoCurrencyName,
			quantity: crypto.cryptoCurrencyAmount,
		}));

	const formattedCryptoCurrenciesManualRates =
		reportContext?.report?.cryptocurrencyManualRates?.map((crypto: any) => {
			// reomve name and url
			const { name, url, ...currencyRates } = crypto;
			// using reduce
			const formattedCurrencyRates: any = []
			Object.keys(currencyRates).forEach(key => {
				if(key.includes('Currency')) {
					return;
				}
				formattedCurrencyRates.push({
					name: key,
					rate: currencyRates[key],
					currency: currencyRates[`${key}Currency`]
				})
			});


			return {
				url: crypto.url,
				name: crypto.name,
				cryptocurrency_rates: formattedCurrencyRates,
			};
		});

	const reportFormatted = {
		cryptocurrenciesAmount: formattedCryptoCurrenciesAmount,
		cryptocurrencyManualRates: formattedCryptoCurrenciesManualRates,
	};

	React.useEffect(() => {
		const asyncReq = async (report: any) => {
			const reportFormatted = _.mapKeys(report, (value, key) =>
				_.snakeCase(key)
			);
			const response = await postReport(reportFormatted);
			console.log(response.data)
		}
		// values of reportFormatted not null
		let yep = false;
		Object.values(reportFormatted).forEach(value => {
			if(value !== undefined && value === null) {
				yep = true;
			}
		})
		if(!yep)
			asyncReq(reportFormatted);
	}, [reportContext]);



	return (
		<Box>
			<Typography>Podgląd raportu</Typography>
		</Box>
	);
};

const ReportContext = React.createContext<any>({});

export const App = () => {
	const { control, handleSubmit, register } = useForm({
		defaultValues: {
			enforcementAuthority: '',
			caseNumber: '',
			ownerData: '',
		},
	});
	const [report, setReport] = React.useState({});
	console.log(report);

	return (
		<Grid container spacing={0}>
			<ReportContext.Provider value={{ report, setReport }}>
				<Grid item xs={6}>
					<Box
						sx={{
							p: '1em',
							gap: '2em',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<DataForm />
						<CryptoCurrencyWrapper />
						<CryptoCurrencySourceWrapper />
						<Button
							type='submit'
							color='success'
							variant='contained'
						>
							Wygeneruj raport
						</Button>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<ReportPreview />
				</Grid>
			</ReportContext.Provider>
		</Grid>
	);
};
