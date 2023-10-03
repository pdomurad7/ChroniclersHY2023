import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {saveAs } from 'file-saver';
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
	Divider,
} from '@mui/material';
import { useQuery } from 'react-query';
import { getChiefNames, getCryptoCurrencies, postReport, postReportPDF } from './api';

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
	const { data: chiefNames } = useQuery('chiefNames', getChiefNames);
	const reportContext = React.useContext(ReportContext);
	const watchAllFields = watch();
	const prevWatchAllFieldsRef = React.useRef({
		enforcementAuthority: '',
		caseNumber: '',
		ownerData: '',
	});

	React.useEffect(() => {
		if (
			JSON.stringify(prevWatchAllFieldsRef.current) !==
			JSON.stringify(watchAllFields)
		) {
			reportContext.setReport((prevValue: any) => ({
				...prevValue,
				basic: {
					...watchAllFields,
				},
			}));
		}

		prevWatchAllFieldsRef.current = watchAllFields;
	}, [watchAllFields]);

	return (
		<Box
			component={Paper}
			elevation={3}
			sx={{
				p: '2em',
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
					<>
						<Select
							{...field}
							id='enforcementAuthority'
							label={labels.enforcementAuthority.label}
							inputProps={{
								sx: {
									color: 'black',
								},
							}}
						>
							{chiefNames?.map((name: any, index: any) => (
								<MenuItem key={index} value={name}>
									{name}
								</MenuItem>
							))}
						</Select>
					</>
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
	const reportContext = React.useContext(ReportContext);

	const cryptoCurrencyOptions = cryptoCurrencyData?.map(
		(cryptoCurrency: any) =>
			`${cryptoCurrency.name} (${cryptoCurrency.code})`
	);

	React.useEffect(() => {
		const currencyMapper = cryptoCurrencyData?.reduce(
			(acc: any, cryptoCurrency: any) => {
				acc[`${cryptoCurrency.name} (${cryptoCurrency.code})`] =
					cryptoCurrency;
				return acc;
			},
			{}
		);
		reportContext.setReport((prevValue: any) => ({
			...prevValue,
			currencyMapper: currencyMapper,
		}));
	}, [cryptoCurrencyData]);

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
		<Box
			component={Paper}
			elevation={3}
			sx={{ display: 'flex', gap: '2em', p: '2em' }}
		>
			{' '}
			<CryptoCurrencyDataForm onAppend={onAppend} />{' '}
			<Box
				sx={{
					overflowY: 'auto',
					maxHeight: '400px',
					minHeight: '400px',
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
		<Card elevation={3}>
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
		formState: { errors },
	} = useForm();
	const reportContext = React.useContext(ReportContext);
	const amountList = reportContext.report?.cryptocurrenciesAmount;
	const uniqueCryptoCurrencyNames =
		Array.from(
			new Set(
				amountList?.map(
					(crypto: any) => crypto.cryptoCurrencyName?.toString() || ''
				)
			)
		) || [];

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
				{uniqueCryptoCurrencyNames?.length > 0 &&
					uniqueCryptoCurrencyNames.map((crypto: any, index: any) => {
						return (
							<Box key={index}>
								<Controller
									name={`${crypto}`}
									control={control}
									rules={{
										required: 'Pole wymagane',
									}}
									defaultValue=''
									render={({ field }) => (
										<TextField
											error={Boolean(errors.cryptoRate)}
											label={`Kurs ${crypto}`}
											helperText={
												errors.cryptoRate?.message
											}
											variant='outlined'
											{...field}
										/>
									)}
								/>
								<Controller
									name={`${crypto}Currency`}
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
		<Box
			component={Paper}
			elevation={3}
			sx={{ display: 'flex', gap: '2em', p: '2em' }}
		>
			<CryptoCurrencySourceForm onAppend={onAppend} />
			<Box
				sx={{
					overflowY: 'auto',
					maxHeight: '600px',
					minHeight: '600px',
				}}
			>
				<Grid container spacing={2}>
					{dataList.map((cryptoCurrencySource, index) => {
						console.log(
							'labelValues (keys)',
							Object.keys(cryptoCurrencySource)
						);
						console.log(
							'labels default',
							cryptoCurrencySourceLabels
						);

						const labelValues = Object.keys(
							cryptoCurrencySource
						).map((key: string) => {
							return {
								label: key,
								value: cryptoCurrencySource[key],
							};
						});

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
	const [reportPreview, setReportPreview] = React.useState<any>();

	const formattedCryptoCurrenciesAmount =
		reportContext?.report?.cryptocurrenciesAmount?.map((crypto: any) => ({
			code: reportContext.report.currencyMapper[crypto.cryptoCurrencyName]
				.code,
			quantity: Number(crypto.cryptoCurrencyAmount),
		}));
	const formattedCryptoCurrenciesManualRates =
		reportContext?.report?.cryptocurrencyManualRates?.map((crypto: any) => {
			// reomve name and url
			const { name, url, ...currencyRates } = crypto;
			// using reduce
			const formattedCurrencyRates: any = [];
			Object.keys(currencyRates).forEach((key) => {
				if (key.includes('Currency')) {
					return;
				}
				formattedCurrencyRates.push({
					name: key,
					rate: Number(currencyRates[key]),
					currency: currencyRates[`${key}Currency`],
				});
			});

			return {
				url: crypto.url,
				name: crypto.name,
				cryptocurrency_rates: formattedCurrencyRates,
			};
		});

	const reportFormatted = {
		// valueCurrency: 'PLN',
		// title: 'Report XD'
		officerName: reportContext?.report?.basic?.enforcementAuthority || '',
		caseNumber: reportContext?.report?.basic?.caseNumber || '',
		ownerData: reportContext?.report?.basic?.ownerData || '',
		cryptocurrenciesAmount: formattedCryptoCurrenciesAmount || [],
		cryptocurrencyManualRates: formattedCryptoCurrenciesManualRates || [],
	};

	React.useEffect(() => {
		const asyncReq = async (report: any) => {
			const reportFormatted = _.mapKeys(report, (value, key) =>
				_.snakeCase(key)
			);
			const response = await postReport(reportFormatted);
			setReportPreview(response);
		};
		asyncReq(reportFormatted);
	}, [reportContext]);

	if (!reportPreview) {
		return (
			<Box>
				<Typography>Brak danych</Typography>
			</Box>
		);
	}
	return (
		<Box
			component={Paper}
			elevation={5}
			sx={{
				p: '2em',
				border: '1px solid black',
				borderRadius: '8px',
			}}
		>
			<Typography sx={{ fontWeight: 'bold' }} variant='h3'>
				Podgląd raportu
			</Typography>
			<Divider sx={{ mt: '1em', mb: '1em' }} />
			<Box>
				<InputLabel>Nazwa organu egzekucyjnego</InputLabel>
				<Typography>{reportPreview.officer_name}</Typography>
			</Box>
			<Box>
				<InputLabel>Dane właściciela kryptoaktywa</InputLabel>
				<Typography>{reportPreview.owner_data}</Typography>
			</Box>
			<Box>
				<InputLabel>ID raportu</InputLabel>
				<Typography>{reportPreview.id}</Typography>
			</Box>
			<Box>
				<InputLabel>Numer sprawy</InputLabel>
				<Typography>{reportPreview.case_number}</Typography>
			</Box>
			<Box>
				<InputLabel>Data raportu</InputLabel>
				<Typography>{reportPreview.date}</Typography>
			</Box>
			<Box>
				<InputLabel>Metoda wyliczenia średniej</InputLabel>
				<Typography>{reportPreview.calculation_method}</Typography>
			</Box>
			<Divider sx={{ mt: '1em', mb: '1em' }} />

			{reportPreview.exchange_data.map(
				(exchange_data: any, index: any) => {
					return (
						<Box
							key={index}
							sx={{
								marginTop: '10px',
								p: '1em',
								borderRadius: '10px',
								backgroundColor: '#f5f5f5',
							}}
						>
							<Box>
								<InputLabel>Kantor</InputLabel>
								<Typography>{exchange_data.name}</Typography>
							</Box>

							<Box>
								<InputLabel>Adres strony</InputLabel>
								<Typography>{exchange_data.url}</Typography>
							</Box>

							<Divider sx={{ mt: '1em', mb: '1em' }} />

							<Box>
								{exchange_data.cryptocurrency_rates.map(
									(rate: any, index: any) => {
										return (
											<Box
												key={index}
												sx={{
													marginTop: '10px',
												}}
											>
												<Box>
													<InputLabel>
														Kurs NBP USD
													</InputLabel>
													<Typography>
														{rate.NBP_USD_rate}
													</Typography>
												</Box>
												<Box>
													<InputLabel>
														Kurs PLN
													</InputLabel>
													<Typography>
														{rate.PLN_rate}
													</Typography>
												</Box>
												{rate.USD_rate && (
													<Box>
														<InputLabel>
															Kurs USD
														</InputLabel>
														<Typography>
															{rate.USD_rate}
														</Typography>
													</Box>
												)}
												<Box>
													<InputLabel>
														Kryptowaluta
													</InputLabel>
													<Typography>
														{rate.code}
													</Typography>
												</Box>
												<Box>
													<InputLabel>
														Ilość
													</InputLabel>
													<Typography>
														{rate.quantity}
													</Typography>
												</Box>
												<Box>
													<InputLabel>
														Wartość (PLN)
													</InputLabel>
													<Typography>
														{rate.value}
													</Typography>
												</Box>
											</Box>
										);
									}
								)}
							</Box>

							{exchange_data.cryptocurrency_rates.length ===
								0 && (
								<Box sx={{ mt: '1em' }}>
									<InputLabel>
										Brak danych dla tego kantoru
									</InputLabel>
								</Box>
							)}
						</Box>
					);
				}
			)}

			<Divider sx={{ mt: '1em', mb: '1em' }} />

			{reportPreview.cryptocurrencies_data.map(
				(crypto: any, index: any) => {
					return (
						<Box
							key={index}
							sx={{
								marginTop: '10px',
							}}
						>
							<InputLabel>Kryptowaluta</InputLabel>
							<Typography>{crypto.name}</Typography>
							<InputLabel>Średnia wartość (PLN)</InputLabel>
							<Typography>{crypto.avg_value}</Typography>

							<InputLabel>Źródła danych</InputLabel>
							{crypto.data_sources.map(
								(source: any, index: any) => {
									return (
										<Box key={index}>
											<Typography>- {source}</Typography>
										</Box>
									);
								}
							)}
						</Box>
					);
				}
			)}
		</Box>
	);
};

const ReportContext = React.createContext<any>({});

export const App = () => {
	const [report, setReport] = React.useState<any>();

	const sendReport = async () => {
		const formattedCryptoCurrenciesAmount =
			report?.cryptocurrenciesAmount?.map(
				(crypto: any) => ({
					name: report.currencyMapper[
						crypto.cryptoCurrencyName
					].code,
					quantity: Number(crypto.cryptoCurrencyAmount),
				})
			);
		const formattedCryptoCurrenciesManualRates =
			report?.cryptocurrencyManualRates?.map(
				(crypto: any) => {
					// reomve name and url
					const { name, url, ...currencyRates } = crypto;
					// using reduce
					const formattedCurrencyRates: any = [];
					Object.keys(currencyRates).forEach((key) => {
						if (key.includes('Currency')) {
							return;
						}
						formattedCurrencyRates.push({
							code: key,
							rate: Number(currencyRates[key]),
							currency: currencyRates[`${key}Currency`],
						});
					});

					return {
						url: crypto.url,
						name: crypto.name,
						cryptocurrency_rates: formattedCurrencyRates,
					};
				}
			);

		const reportFormatted = {
			valueCurrency: 'PLN',
			name: report?.basic?.enforcementAuthority || '',
			caseNumber: report?.basic?.caseNumber || '',
			ownerData: report?.basic?.ownerData || '',
			cryptocurrenciesAmount: formattedCryptoCurrenciesAmount || [],
			cryptocurrencyManualRates:
				formattedCryptoCurrenciesManualRates || [],
		};
		const reportFormattedReq = _.mapKeys(reportFormatted, (value, key) =>
			_.snakeCase(key)
		);
		const response = await postReportPDF(reportFormattedReq);
		const blob = new Blob([response?.data], { type: 'application/pdf' });
		saveAs(blob, 'raport.pdf');
		console.log(response);
	};

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
							onClick={() => sendReport()}
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
