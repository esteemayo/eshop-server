const createSendToken = (user, statusCode, res) => {
  const accessToken = user.generateAuthToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    signed: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', accessToken, cookieOptions);

  // remove password from output
  const { password, ...rest } = user._doc;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    user: rest,
  });
};

module.exports = createSendToken;
