import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { showToast } from '../component/CustomToast';
import api from '../Utils/api';
import CustomPersonStatusDropdown from '../component/CustomPersonStatusDropdown';
import { Radio } from 'native-base';

const CustomDateField = props => {
    return (
        <View style={styles.dateFieldContainer}>
            <DateField {...props} />
        </View>
    );
};

const RegisterForm = ({ route }) => {
    const { locations_id } = route.params;
    const navigation = useNavigation();

    const [firstname, setFirstname] = useState('');
    const [lastName, setLastName] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [mobile_number, setMobileNumber] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [gender, setGender] = useState('');
    const [education, setEducation] = useState('');
    const [address, setAddress] = useState('');
    const [job, setJob] = useState('');
    const [marital_status, setMaritalStatus] = useState('');

    const [firstnameError, setfirstnameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [middlenameError, setmiddlenameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [dobError, setdobError] = useState('');
    const [mobile_numberError, setmobile_numberError] = useState('');
    const [stateError, setstateError] = useState('');
    const [cityError, setcityError] = useState('');
    const [pincodeError, setpincodeError] = useState('');
    const [educationError, seteducationError] = useState('');
    const [addressError, setaddressError] = useState('');
    const [jobError, setjobError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [genderError, setgenderError] = useState('');
    const [maritalStatusError, setMaritalStatusError] = useState('');
    const [fcmtoken, setFcmtoken] = useState('');

    const [userData, setUserData] = useState(null);
    const { t } = useTranslation();

    const initialLabel = t('maritalstatus');
    const married = t('married');
    const unmarried = t('unmarried');
    const widower = t('widower');
    const widow = t('widow');
    const divorcee = t('divorcee');
    const emailRegex = /^[^\s@]+@[^\s@]+\.(?:com|co)$/;

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDob(selectedDate);
        }
    };

    const formatDate = date => {
        const formattedDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return formattedDate.toLocaleDateString(undefined, options);
    };

    const handleRegister = async text => {
        const expectedPasswordPattern =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

        let isValid = true;
        if (!firstname) {
            setfirstnameError(t('pleaseenterfirstname'));
            isValid = false;
        } else {
            setfirstnameError('');
        }
        if (!lastName) {
            setLastNameError(t('pleaseenterlastname'));
            isValid = false;
        } else {
            setLastNameError('');
        }

        if (!middlename) {
            setmiddlenameError(t('pleaseentermiddlename'));
            isValid = false;
        } else {
            setmiddlenameError('');
        }

        if (!email) {
            setEmailError(t('Please enter your email address.'));
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError(t('Please enter a valid email address.'));
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError(t('pleaseenterpassword'));
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError(t('passwordmusthaveatleastcharacters'));
            isValid = false;
        } else if (!expectedPasswordPattern.test(password)) {
            setPasswordError(
                t('passwordmusthaveatleastoneletteronenumberandonespecialcharacter'),
            );
            isValid = false;
        } else {
            setPasswordError('');
        }
        if (!dob) {
            setdobError(t('pleaseenterdob'));
            isValid = false;
        } else {
            setdobError('');
        }
        if (!mobile_number) {
            setmobile_numberError(t('pleaseentermobilenumber'));
            isValid = false;
        } else if (isNaN(mobile_number) || mobile_number.length !== 10) {
            setmobile_numberError(t('pleaseenteravalidmobilenumber'));
            isValid = false;
        } else {
            setmobile_numberError('');
        }
        if (!state) {
            setstateError(t('pleaseenterstate'));
            isValid = false;
        } else {
            setstateError('');
        }
        if (!city) {
            setcityError(t('pleaseentercity'));
            isValid = false;
        } else {
            setcityError('');
        }
        if (!pincode) {
            setpincodeError(t('pleaseenterpincode'));
            isValid = false;
        } else if (isNaN(pincode) || pincode.length !== 6) {
            setpincodeError(t('pleaseenteravalidpincodenumber'));
            isValid = false;
        } else {
            setpincodeError('');
        }
        if (!education) {
            seteducationError(t('pleaseentereducation'));
            isValid = false;
        } else {
            seteducationError('');
        }
        if (!address) {
            setaddressError(t('pleaseenteraddress'));
            isValid = false;
        } else {
            setaddressError('');
        }
        if (!job) {
            setjobError(t('pleaseenterjob'));
            isValid = false;
        } else {
            setjobError('');
        }
        if (!gender) {
            setgenderError(t('pleaseentergender'));
            isValid = false;
        } else {
            setgenderError('');
        }
        if (!marital_status) {
            setMaritalStatusError(t('pleasechoosemaritalstatus'));
            isValid = false;
        } else {
            setMaritalStatusError('');
        }

        if (isValid) {
            const userData = new FormData();
            console.log(userData, "userData")
            userData.append('firstname', firstname);
            userData.append('lastName', lastName);
            userData.append('middlename', middlename);
            userData.append('email', email);
            userData.append('locations_id', locations_id);
            userData.append('dob', dob);
            userData.append('mobile_number', mobile_number);
            userData.append('password', password);
            userData.append('state', state);
            userData.append('city', city);
            userData.append('pincode', pincode);
            userData.append('gender', gender);
            userData.append('education', education);
            userData.append('address', address);
            userData.append('job', job);
            userData.append('marital_status', marital_status);
            userData.append('fcmtoken', fcmtoken);

            try {
                const PerentsData = {
                    firstname: firstname,
                    lastName: lastName,
                    middlename: middlename,
                    email: email,
                    locations_id: locations_id,
                    dob: dob,
                    mobile_number: mobile_number,
                    password: password,
                    state: state,
                    city: city,
                    pincode: pincode,
                    gender: gender,
                    education: education,
                    address: address,
                    job: job,
                    marital_status: marital_status,
                    device_token: fcmtoken,
                    payment_id: null,
                }
                console.log(PerentsData, "PerentsData")

                const response = await api.post(`/check_mobile`, { mobile_number: mobile_number, })
                console.log(response.data, "check_mobile")
                if (response.data.mobileError === 'Mobile number already register') {
                    showToast(
                        'error',
                        t('mobilenumberisalreadyregistered'),
                        2500,
                    );
                } else {
                    AsyncStorage.setItem('PerentsData', JSON.stringify(PerentsData));
                    setFirstname('');
                    setLastName('');
                    setMiddlename('');
                    setEmail('');
                    setPassword('');
                    setDob(null);
                    setShowPicker(false);
                    setMobileNumber('');
                    setState('');
                    setCity('');
                    setPincode('');
                    setGender('');
                    setEducation('');
                    setAddress('');
                    setJob('');
                    setMaritalStatus('');
                    navigation.navigate('PaymentPage');
                }

            } catch (error) {
                if (error.response) {
                    console.log('Status code:', error.response);
                } else {
                    console.error('Error:', error.message);
                }
            }
        } else {
            showToast(
                'error',
                t('pleasefillalltherequiredfields'),
                2500,
            );
        }
    };

    useEffect(() => {
        const dataaa = AsyncStorage.getItem('userData');
        GetFCMToken()
        showToast(
            'info',
            t('registerthemainmemberofthehouse'),
            6000,
        );
    }, []);
    const GetFCMToken = async () => {
        try {
            let fcmtoken = await AsyncStorage.getItem("fcmtoken");
            setFcmtoken(fcmtoken)
            console.log(fcmtoken, 'fcmtoken')
            if (!fcmtoken) {
                const femtoken = await messaging().getToken();
                if (femtoken) {
                    console.log(femtoken, "new token");
                    setFcmtoken(fcmtoken)
                    await AsyncStorage.setItem("fcmtoken", femtoken);
                }
            }
        } catch (error) {
            console.log(error, "error in GetFCMToken");
        }
    };
    const getSelectedvalue = (selected_maritalstatus) => {
        setMaritalStatus(selected_maritalstatus);
    }
    return (
        <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover" >
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.childContainer}>
                    <View>
                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: firstnameError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('firstname')}
                            value={firstname}
                            onChangeText={setFirstname}
                        />
                        {firstnameError && (
                            <Text style={styles.error}>{firstnameError}</Text>
                        )}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: lastNameError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('lastname')}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        {lastNameError && (
                            <Text style={styles.error}>{lastNameError}</Text>
                        )}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input, {
                                    shadowColor: middlenameError ? '#ff0000' : 'gray'
                                },
                            ]}
                            placeholder={t('middlename')}
                            value={middlename}
                            onChangeText={setMiddlename}
                        />
                        {middlenameError && (
                            <Text style={styles.error}>{middlenameError}</Text>
                        )}
                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: emailError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('Email')}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                    </View>
                    <TextInput
                        style={[
                            styles.input,
                            { shadowColor: passwordError ? '#ff0000' : 'gray' },
                        ]}
                        placeholder={t('password')}
                        placeholderTextColor="gray"
                        onChangeText={setPassword}
                        value={password}
                    />
                    {passwordError && <Text style={styles.error}>{passwordError}</Text>}

                    <View>
                        <Pressable onPress={() => setShowPicker(true)}>
                            <TextInput
                                style={[
                                    styles.input,
                                    { shadowColor: dobError ? '#ff0000' : 'gray' },
                                ]}
                                placeholderTextColor="gray"
                                placeholder={t('dateofbirth')}
                                editable={false}
                                value={dob ? formatDate(dob) : ''}
                            />
                        </Pressable>
                        {dobError && <Text style={styles.error}>{dobError}</Text>}

                        {showPicker && (
                            <DateTimePicker
                                value={dob || new Date()}
                                mode="date"
                                display="spinner"
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View>
                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: mobile_numberError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('mobile')}
                            value={mobile_number}
                            onChangeText={setMobileNumber}
                            maxLength={10}
                            keyboardType="numeric"
                        />
                        {mobile_numberError && (
                            <Text style={styles.error}>{mobile_numberError}</Text>
                        )}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: addressError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('address')}
                            value={address}
                            onChangeText={setAddress}
                        />
                        {addressError && <Text style={styles.error}>{addressError}</Text>}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: cityError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('city')}
                            value={city}
                            onChangeText={setCity}
                        />
                        {cityError && <Text style={styles.error}>{cityError}</Text>}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: stateError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('state')}
                            value={state}
                            onChangeText={setState}
                        />
                        {stateError && <Text style={styles.error}>{stateError}</Text>}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: pincodeError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('pincode')}
                            value={pincode}
                            onChangeText={setPincode}
                            keyboardType="numeric"
                        />
                        {pincodeError && <Text style={styles.error}>{pincodeError}</Text>}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: educationError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('education')}
                            value={education}
                            onChangeText={setEducation}
                        />
                        {educationError && (
                            <Text style={styles.error}>{educationError}</Text>
                        )}

                        <TextInput
                            placeholderTextColor="gray"
                            style={[
                                styles.input,
                                { shadowColor: jobError ? '#ff0000' : 'gray' },
                            ]}
                            placeholder={t('profession')}
                            value={job}
                            onChangeText={setJob}
                        />
                        {jobError && <Text style={styles.error}>{jobError}</Text>}
                    </View>

                    <View
                        style={[
                            styles.inputContainer,
                            {
                                shadowColor: maritalStatusError ? '#ff0000' : 'gray',
                                marginBottom: maritalStatusError ? 16 : 0,
                            },
                        ]}>
                        <CustomPersonStatusDropdown selectedVillage={marital_status} accessibilityLabel="Select Marital Status" placeholder="Select Marital Status" selctedValue={getSelectedvalue} />
                        {maritalStatusError && (
                            <Text style={styles.error}>{maritalStatusError}</Text>
                        )}
                    </View>

                    <View
                        style={[
                            styles.gender,
                            { shadowColor: genderError ? '#ff0000' : 'gray' },
                        ]}>
                        <Text style={styles.radioLabel}>{t('chooseyourgender')}</Text>
                        <View style={styles.radioContainer}>
                            <Radio.Group
                                name="gender"
                                value={gender}
                                onChange={(nextValue) => {
                                    setGender(nextValue);
                                }}
                                style={styles.radioContainer}
                            >

                                <Text style={styles.radioLabel}>Male</Text>
                                <Radio value="male" ml={1} my={1} colorScheme="blue" />



                                <Text style={styles.radioLabel}>Female</Text>
                                <Radio value="female" ml={1} my={1} colorScheme="blue" />



                                <Text style={styles.radioLabel}>Other</Text>
                                <Radio value="other" ml={1} my={1} colorScheme="blue" />

                            </Radio.Group>
                        </View>
                    </View>
                    {genderError && <Text style={styles.error}>{genderError}</Text>}
                    <Pressable style={styles.button} onPress={handleRegister}>
                        <Text style={styles.btntext}> Save </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    childContainer: {
        padding: 16,
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#515151',
        textTransform: 'uppercase',
    },

    image: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 6,
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: 1,
    },

    input: {
        // borderWidth: 1,
        elevation: 5,
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 6,
        color: 'black',
        paddingHorizontal: 8,
        height: 50,
    },
    inputContainer: {
        height: 45,
        // borderWidth: 1,
        elevation: 5,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginTop: 16,
        justifyContent: 'center',
        overflow: 'hidden'
    },

    button: {
        height: 50,
        backgroundColor: '#00a9ff',
        borderRadius: 6,
        elevation: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    btntext: {
        color: 'white',
        fontSize: 20,
        textTransform: 'uppercase',
    },

    gender: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        padding: 5,
        elevation: 5,
        backgroundColor: '#fff',
        marginTop: 16,
        // borderWidth: 1,
        borderRadius: 6,
    },

    radioContainer: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
    },

    radioLabel: {
        marginLeft: 5,
        color: 'black',
    },

    error: {
        color: '#ff0000',
        fontSize: 15,
        textAlign: 'right',
        paddingRight: 6,
    },
});

export default RegisterForm;