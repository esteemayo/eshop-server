const createSendToken = (user, statusCode, req, res) => {
  const accessToken = user.generateAuthToken();

  res.cookie('jwt', accessToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    path: '/',
  });

  const { password, role, ...rest } = user._doc;

  const details = {
    accessToken,
    ...rest,
  };

  res.status(statusCode).json({
    status: 'success',
    details,
    role,
  });
};

export default createSendToken;
