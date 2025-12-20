{loading ? (
                        <span className="loading loading-spinner text-error"></span>
                    ) : user ? (
                        /* Logged In User Dropdown */
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-red-500 ring-offset-base-100 ring-offset-2">
                                <div className="w-10 rounded-full">
                                    <img src={userPhoto} alt={userName} className="rounded-full" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-4 shadow-lg bg-base-100 rounded-xl w-60">
                                <li className="font-semibold text-red-600 mb-2">
                                    <p className="p-0 m-0">
                                        {userName}
                                        <span className="text-xs text-gray-500 block mt-0.5">({userRole.toUpperCase()})</span>
                                    </p>
                                </li>
                                <div className="divider my-0.5" />
                                {/* userMenu ভ্যারিয়েবল ব্যবহার করা হলো */}
                                {userMenu} 
                            </ul>
                        </div>
                    ) : (
                        /* Logged Out Buttons (Auth Buttons) */
                        authButtons // authButtons ভ্যারিয়েবল ব্যবহার করা হলো
                    )}