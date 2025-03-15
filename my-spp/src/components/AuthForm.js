import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { gsap } from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AuthForm.css';
const SpringBootUrl=process.env.REACT_APP_SPRINGBOOT_URL;
const AuthForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form state
    const [fullName, setFullName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        gsap.set('.auth-form form', { opacity: 0, y: 20 });
        gsap.to('.auth-form form', {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, []);

    const toggleForm = (isLogin) => {
        setIsLogin(isLogin);
        setMessage('');
        gsap.to('.auth-form .login-form', {
            maxHeight: isLogin ? '400px' : 0,
            opacity: isLogin ? 1 : 0,
            duration: 0.3,
            ease: 'power2.out',
        });
        gsap.to('.auth-form .register-form', {
            maxHeight: !isLogin ? '400px' : 0,
            opacity: !isLogin ? 1 : 0,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${SpringBootUrl}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginEmail, password: loginPassword }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            login(data.token, {
                id: data.id,
                username: data.username,
                roles: data.roles,
            });

            // Show success toast
            toast.success('Login successful! Redirecting...', {
                position: 'top-right',
                autoClose: 3000,
            });

              setTimeout(() => {
                navigate('/interview-practice');
            }, 3000);
        } catch (error) {
            console.error('Error:', error.message);

            // Show error toast
            toast.error('Login failed. Please check your credentials.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${SpringBootUrl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullName,
                    username: registerEmail,
                    number: countryCode + phone,
                    role: ['user'],
                    password: registerPassword,
                }),
            });

            if (response.ok) {
                const result = await response.json();

                // Show success toast
                toast.success('Registration successful!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setTimeout(() => {
                    toggleForm(true);
                }, 3000);
                
            } else {
                // Show error toast
                toast.error('Registration failed. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);

            // Show error toast
            toast.error('An error occurred. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden">
            <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
/>
            <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className={`auth-form bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-3xl ${!isLogin ? 'active-register' : ''}`}>
                    <div className="md:w-1/2">
                        <img
                            src="https://interview.intraintech.com/wp-content/uploads/2024/07/11-768x768.jpg"
                            alt="Booklet Side"
                            className="object-cover h-full w-full rounded-l-lg"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8">
                        <div className="form-toggle-buttons">
                            <button
                                onClick={() => toggleForm(true)}
                                className={isLogin ? 'active' : ''}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => toggleForm(false)}
                                className={!isLogin ? 'active' : ''}
                            >
                                Register
                            </button>
                        </div>
                        {message && <div className="mb-4 text-center text-red-500">{message}</div>}

                        <div className="login-form">
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block mb-1 font-medium">Password</label>
                                    <input
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                                    Login
                                </button>
                            </form>
                        </div>

                        <div className="register-form">
                            <form onSubmit={handleRegister}>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Phone Number</label>
                                    <div className="flex">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="border border-gray-300 p-1 text-sm rounded-l focus:outline-none focus:ring focus:border-blue-500 w-24"
                                            required
                                        >
                                           <option value="+93">+93 (Afghanistan)</option>
                        <option value="+355">+355 (Albania)</option>
                        <option value="+213">+213 (Algeria)</option>
                        <option value="+376">+376 (Andorra)</option>
                        <option value="+244">+244 (Angola)</option>
                        <option value="+1-264">+1-264 (Anguilla)</option>
                        <option value="+1-268">+1-268 (Antigua and Barbuda)</option>
                        <option value="+54">+54 (Argentina)</option>
                        <option value="+374">+374 (Armenia)</option>
                        <option value="+297">+297 (Aruba)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+43">+43 (Austria)</option>
                        <option value="+994">+994 (Azerbaijan)</option>
                        <option value="+1-242">+1-242 (Bahamas)</option>
                        <option value="+973">+973 (Bahrain)</option>
                        <option value="+880">+880 (Bangladesh)</option>
                        <option value="+1-246">+1-246 (Barbados)</option>
                        <option value="+375">+375 (Belarus)</option>
                        <option value="+32">+32 (Belgium)</option>
                        <option value="+501">+501 (Belize)</option>
                        <option value="+229">+229 (Benin)</option>
                        <option value="+1-441">+1-441 (Bermuda)</option>
                        <option value="+975">+975 (Bhutan)</option>
                        <option value="+591">+591 (Bolivia)</option>
                        <option value="+387">+387 (Bosnia and Herzegovina)</option>
                        <option value="+267">+267 (Botswana)</option>
                        <option value="+55">+55 (Brazil)</option>
                        <option value="+246">+246 (British Indian Ocean Territory)</option>
                        <option value="+1-284">+1-284 (British Virgin Islands)</option>
                        <option value="+673">+673 (Brunei)</option>
                        <option value="+359">+359 (Bulgaria)</option>
                        <option value="+226">+226 (Burkina Faso)</option>
                        <option value="+257">+257 (Burundi)</option>
                        <option value="+855">+855 (Cambodia)</option>
                        <option value="+237">+237 (Cameroon)</option>
                        <option value="+1">+1 (Canada)</option>
                        <option value="+238">+238 (Cape Verde)</option>
                        <option value="+1-345">+1-345 (Cayman Islands)</option>
                        <option value="+236">+236 (Central African Republic)</option>
                        <option value="+235">+235 (Chad)</option>
                        <option value="+56">+56 (Chile)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+61">+61 (Christmas Island)</option>
                        <option value="+61">+61 (Cocos Islands)</option>
                        <option value="+57">+57 (Colombia)</option>
                        <option value="+269">+269 (Comoros)</option>
                        <option value="+242">+242 (Congo)</option>
                        <option value="+243">+243 (DR Congo)</option>
                        <option value="+682">+682 (Cook Islands)</option>
                        <option value="+506">+506 (Costa Rica)</option>
                        <option value="+225">+225 (Côte d'Ivoire)</option>
                        <option value="+385">+385 (Croatia)</option>
                        <option value="+53">+53 (Cuba)</option>
                        <option value="+599">+599 (Curaçao)</option>
                        <option value="+357">+357 (Cyprus)</option>
                        <option value="+420">+420 (Czech Republic)</option>
                        <option value="+45">+45 (Denmark)</option>
                        <option value="+253">+253 (Djibouti)</option>
                        <option value="+1-767">+1-767 (Dominica)</option>
                        <option value="+1-809">+1-809 (Dominican Republic)</option>
                        <option value="+593">+593 (Ecuador)</option>
                        <option value="+20">+20 (Egypt)</option>
                        <option value="+503">+503 (El Salvador)</option>
                        <option value="+240">+240 (Equatorial Guinea)</option>
                        <option value="+291">+291 (Eritrea)</option>
                        <option value="+372">+372 (Estonia)</option>
                        <option value="+251">+251 (Ethiopia)</option>
                        <option value="+500">+500 (Falkland Islands)</option>
                        <option value="+298">+298 (Faroe Islands)</option>
                        <option value="+679">+679 (Fiji)</option>
                        <option value="+358">+358 (Finland)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+689">+689 (French Polynesia)</option>
                        <option value="+241">+241 (Gabon)</option>
                        <option value="+220">+220 (Gambia)</option>
                        <option value="+995">+995 (Georgia)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+233">+233 (Ghana)</option>
                        <option value="+350">+350 (Gibraltar)</option>
                        <option value="+30">+30 (Greece)</option>
                        <option value="+299">+299 (Greenland)</option>
                        <option value="+1-473">+1-473 (Grenada)</option>
                        <option value="+590">+590 (Guadeloupe)</option>
                        <option value="+1-671">+1-671 (Guam)</option>
                        <option value="+502">+502 (Guatemala)</option>
                        <option value="+44">+44 (Guernsey)</option>
                        <option value="+224">+224 (Guinea)</option>
                        <option value="+245">+245 (Guinea-Bissau)</option>
                        <option value="+592">+592 (Guyana)</option>
                        <option value="+509">+509 (Haiti)</option>
                        <option value="+504">+504 (Honduras)</option>
                        <option value="+852">+852 (Hong Kong)</option>
                        <option value="+36">+36 (Hungary)</option>
                        <option value="+354">+354 (Iceland)</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+62">+62 (Indonesia)</option>
                        <option value="+98">+98 (Iran)</option>
                        <option value="+964">+964 (Iraq)</option>
                        <option value="+353">+353 (Ireland)</option>
                        <option value="+44">+44 (Isle of Man)</option>
                        <option value="+972">+972 (Israel)</option>
                        <option value="+39">+39 (Italy)</option>
                        <option value="+1-876">+1-876 (Jamaica)</option>
                        <option value="+81">+81 (Japan)</option>
                        <option value="+44">+44 (Jersey)</option>
                        <option value="+962">+962 (Jordan)</option>
                        <option value="+7">+7 (Kazakhstan)</option>
                        <option value="+254">+254 (Kenya)</option>
                        <option value="+686">+686 (Kiribati)</option>
                        <option value="+383">+383 (Kosovo)</option>
                        <option value="+965">+965 (Kuwait)</option>
                        <option value="+996">+996 (Kyrgyzstan)</option>
                        <option value="+856">+856 (Laos)</option>
                        <option value="+371">+371 (Latvia)</option>
                        <option value="+961">+961 (Lebanon)</option>
                        <option value="+266">+266 (Lesotho)</option>
                        <option value="+231">+231 (Liberia)</option>
                        <option value="+218">+218 (Libya)</option>
                        <option value="+423">+423 (Liechtenstein)</option>
                        <option value="+370">+370 (Lithuania)</option>
                        <option value="+352">+352 (Luxembourg)</option>
                        <option value="+853">+853 (Macau)</option>
                        <option value="+389">+389 (Macedonia)</option>
                        <option value="+261">+261 (Madagascar)</option>
                        <option value="+265">+265 (Malawi)</option>
                        <option value="+60">+60 (Malaysia)</option>
                        <option value="+960">+960 (Maldives)</option>
                        <option value="+223">+223 (Mali)</option>
                        <option value="+356">+356 (Malta)</option>
                        <option value="+692">+692 (Marshall Islands)</option>
                        <option value="+596">+596 (Martinique)</option>
                        <option value="+222">+222 (Mauritania)</option>
                        <option value="+230">+230 (Mauritius)</option>
                        <option value="+262">+262 (Mayotte)</option>
                        <option value="+52">+52 (Mexico)</option>
                        <option value="+691">+691 (Micronesia)</option>
                        <option value="+373">+373 (Moldova)</option>
                        <option value="+377">+377 (Monaco)</option>
                        <option value="+976">+976 (Mongolia)</option>
                        <option value="+382">+382 (Montenegro)</option>
                        <option value="+1-664">+1-664 (Montserrat)</option>
                        <option value="+212">+212 (Morocco)</option>
                        <option value="+258">+258 (Mozambique)</option>
                        <option value="+95">+95 (Myanmar)</option>
                        <option value="+264">+264 (Namibia)</option>
                        <option value="+674">+674 (Nauru)</option>
                        <option value="+977">+977 (Nepal)</option>
                        <option value="+31">+31 (Netherlands)</option>
                        <option value="+687">+687 (New Caledonia)</option>
                        <option value="+64">+64 (New Zealand)</option>
                        <option value="+505">+505 (Nicaragua)</option>
                        <option value="+227">+227 (Niger)</option>
                        <option value="+234">+234 (Nigeria)</option>
                        <option value="+683">+683 (Niue)</option>
                        <option value="+672">+672 (Norfolk Island)</option>
                        <option value="+1-670">+1-670 (Northern Mariana Islands)</option>
                        <option value="+47">+47 (Norway)</option>
                        <option value="+968">+968 (Oman)</option>
                        <option value="+92">+92 (Pakistan)</option>
                        <option value="+680">+680 (Palau)</option>
                        <option value="+970">+970 (Palestine)</option>
                        <option value="+507">+507 (Panama)</option>
                        <option value="+675">+675 (Papua New Guinea)</option>
                        <option value="+595">+595 (Paraguay)</option>
                        <option value="+51">+51 (Peru)</option>
                        <option value="+63">+63 (Philippines)</option>
                        <option value="+64">+64 (Pitcairn Islands)</option>
                        <option value="+48">+48 (Poland)</option>
                        <option value="+351">+351 (Portugal)</option>
                        <option value="+1-787">+1-787 (Puerto Rico)</option>
                        <option value="+974">+974 (Qatar)</option>
                        <option value="+262">+262 (Réunion)</option>
                        <option value="+40">+40 (Romania)</option>
                        <option value="+7">+7 (Russia)</option>
                        <option value="+250">+250 (Rwanda)</option>
                        <option value="+590">+590 (Saint Barthélemy)</option>
                        <option value="+290">+290 (Saint Helena)</option>
                        <option value="+1-869">+1-869 (Saint Kitts and Nevis)</option>
                        <option value="+1-758">+1-758 (Saint Lucia)</option>
                        <option value="+590">+590 (Saint Martin)</option>
                        <option value="+508">+508 (Saint Pierre and Miquelon)</option>
                        <option value="+1-784">+1-784 (Saint Vincent and the Grenadines)</option>
                        <option value="+685">+685 (Samoa)</option>
                        <option value="+378">+378 (San Marino)</option>
                        <option value="+239">+239 (São Tomé and Príncipe)</option>
                        <option value="+966">+966 (Saudi Arabia)</option>
                        <option value="+221">+221 (Senegal)</option>
                        <option value="+381">+381 (Serbia)</option>
                        <option value="+248">+248 (Seychelles)</option>
                        <option value="+232">+232 (Sierra Leone)</option>
                        <option value="+65">+65 (Singapore)</option>
                        <option value="+1-721">+1-721 (Sint Maarten)</option>
                        <option value="+421">+421 (Slovakia)</option>
                        <option value="+386">+386 (Slovenia)</option>
                        <option value="+677">+677 (Solomon Islands)</option>
                        <option value="+252">+252 (Somalia)</option>
                        <option value="+27">+27 (South Africa)</option>
                        <option value="+82">+82 (South Korea)</option>
                        <option value="+211">+211 (South Sudan)</option>
                        <option value="+34">+34 (Spain)</option>
                        <option value="+94">+94 (Sri Lanka)</option>
                        <option value="+249">+249 (Sudan)</option>
                        <option value="+597">+597 (Suriname)</option>
                        <option value="+47">+47 (Svalbard and Jan Mayen)</option>
                        <option value="+268">+268 (Swaziland)</option>
                        <option value="+46">+46 (Sweden)</option>
                        <option value="+41">+41 (Switzerland)</option>
                        <option value="+963">+963 (Syria)</option>
                        <option value="+886">+886 (Taiwan)</option>
                        <option value="+992">+992 (Tajikistan)</option>
                        <option value="+255">+255 (Tanzania)</option>
                        <option value="+66">+66 (Thailand)</option>
                        <option value="+670">+670 (Timor-Leste)</option>
                        <option value="+228">+228 (Togo)</option>
                        <option value="+690">+690 (Tokelau)</option>
                        <option value="+676">+676 (Tonga)</option>
                        <option value="+1-868">+1-868 (Trinidad and Tobago)</option>
                        <option value="+216">+216 (Tunisia)</option>
                        <option value="+90">+90 (Turkey)</option>
                        <option value="+993">+993 (Turkmenistan)</option>
                        <option value="+1-649">+1-649 (Turks and Caicos Islands)</option>
                        <option value="+688">+688 (Tuvalu)</option>
                        <option value="+256">+256 (Uganda)</option>
                        <option value="+380">+380 (Ukraine)</option>
                        <option value="+971">+971 (United Arab Emirates)</option>
                        <option value="+44">+44 (United Kingdom)</option>
                        <option value="+1">+1 (United States)</option>
                        <option value="+598">+598 (Uruguay)</option>
                        <option value="+998">+998 (Uzbekistan)</option>
                        <option value="+678">+678 (Vanuatu)</option>
                        <option value="+379">+379 (Vatican City)</option>
                        <option value="+58">+58 (Venezuela)</option>
                        <option value="+84">+84 (Vietnam)</option>
                        <option value="+1-340">+1-340 (Virgin Islands, U.S.)</option>
                        <option value="+681">+681 (Wallis and Futuna)</option>
                        <option value="+967">+967 (Yemen)</option>
                        <option value="+260">+260 (Zambia)</option>
                        <option value="+263">+263 (Zimbabwe)</option>
                                        </select>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="flex-1 border border-gray-300 p-2 rounded-r focus:outline-none focus:ring focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Password</label>
                                    <input
                                        type="password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block mb-1 font-medium">Re-type Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
