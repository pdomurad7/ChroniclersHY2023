import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { getChiefNames, getCryptoCurrencies } from './api';

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
		name: 'cryptoCurrencyName',
		label: 'Nazwa kryptoaktywa',
	},
	cryptoCurrencyAmount: {
		name: 'cryptoCurrencyAmount',
		label: 'Ilość',
	},
};

const cryptoCurrencySourceLabels: any = {
	exchangeUrl: {
		name: 'exchangeUrl',
		label: 'Adres strony giełdy/kantoru',
	},
	exchangeName: {
		name: 'exchangeName',
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
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: {
			enforcementAuthority: '',
			caseNumber: '',
			ownerData: '',
		},
		mode: 'onChange',
	});

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
								{name}
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

const useDataList = () => {
	const [dataList, setDataList] = React.useState<any[]>([]);

	const onAppend = (data: any) => {
		setDataList([...dataList, data]);
	};

	const onRemove = (index: number) => {
		const newList = dataList.filter((_, i) => i !== index);
		setDataList(newList);
	};

	return { dataList, onAppend, onRemove };
};

export const CryptoCurrencyDataForm = ({ onAppend }: any) => {
	const {
		control,
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm();
  const { data: cryptoCurrencyData, isLoading } = useQuery('cryptoCurrencyData', getCryptoCurrencies);

  const cryptoCurrencyOptions = cryptoCurrencyData?.map((cryptoCurrency: any) => `${cryptoCurrency.name} (${cryptoCurrency.code})`)
  if(isLoading){
    return <div>Ładowanie...</div>
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
	const { dataList, onAppend, onRemove } = useDataList();

	return (
		<Box sx={{ display: 'flex', gap: '2em' }}>
			<CryptoCurrencyDataForm onAppend={onAppend} />
			<Box sx={{ overflowY: 'auto', maxHeight: '400px', width: '500px', flex: 1 }}>
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
					name={cryptoCurrencySourceLabels.exchangeUrl.name}
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
					name={cryptoCurrencySourceLabels.exchangeName.name}
					control={control}
					defaultValue=''
					rules={{
						required: 'Pole wymagane',
					}}
					render={({ field }) => (
						<TextField
							label='Nazwa giełdy/kantoru'
							error={Boolean(errors.exchangeName)}
							helperText={errors.exchangeName?.message}
							variant='outlined'
							fullWidth
							{...field}
						/>
					)}
				/>
				<Box>
					<Controller
						name={cryptoCurrencySourceLabels.cryptoRate.name}
						control={control}
						rules={{
							required: 'Pole wymagane',
						}}
						defaultValue=''
						render={({ field }) => (
							<TextField
								error={Boolean(errors.cryptoRate)}
								label='Kurs kryptoaktywa'
								helperText={errors.cryptoRate?.message}
								variant='outlined'
								{...field}
							/>
						)}
					/>
					<Controller
						name={cryptoCurrencySourceLabels.currency.name}
						control={control}
						defaultValue='PLN'
						render={({ field }) => (
							<Select {...field} sx={{ minWidth: 100 }}>
								<MenuItem value='PLN'>PLN</MenuItem>
								<MenuItem value='USD'>USD</MenuItem>
							</Select>
						)}
					/>
				</Box>
				<Button variant='contained' type='submit'>
					Dodaj
				</Button>
			</Box>
		</Box>
	);
};

const CryptoCurrencySourceWrapper = () => {
	const { dataList, onAppend, onRemove } = useDataList();

	return (
		<Box sx={{ display: 'flex', gap: '2em' }}>
			<CryptoCurrencySourceForm onAppend={onAppend} />
			<Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
				<Grid container spacing={2}>
					{dataList.map((cryptoCurrencySource, index) => {
						const labelValues = Object.keys(
							cryptoCurrencySource
						).map((key: string) => ({
							label: cryptoCurrencySourceLabels[key].label,
							value: cryptoCurrencySource[key],
						}));
						return (
							<Grid item xs={4} key={index}>
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
	return (
		<Box>
			<Typography>Podgląd raportu</Typography>
		</Box>
	);
};

export const App = () => {
	const { control, handleSubmit, register } = useForm({
		defaultValues: {
			enforcementAuthority: '',
			caseNumber: '',
			ownerData: '',
		},
	});

	return (
		<Grid container spacing={0}>
			<Grid item xs={6}>
				<Box sx={{p:'1em', gap: '2em', display: 'flex', flexDirection: 'column' }}>
					<DataForm />
					<CryptoCurrencyWrapper />
					<CryptoCurrencySourceWrapper />
					<Button type='submit' color='success' variant='contained'>
						Wygeneruj raport
					</Button>
				</Box>
			</Grid>
			<Grid item xs={6}>
				<ReportPreview />
			</Grid>
		</Grid>
	);
};
