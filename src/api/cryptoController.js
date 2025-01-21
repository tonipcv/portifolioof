const addCryptoToPortfolio = async (req, res) => {
  try {
    const { userId, cryptoData } = req.body;
    const user = await User.findById(userId);
    
    // Verifica se é usuário gratuito e já atingiu o limite
    const currentCryptos = await Crypto.find({ userId });
    if (!user.isPremium && currentCryptos.length >= 3) {
      return res.status(403).json({ 
        error: 'Limite de criptomoedas atingido para conta gratuita' 
      });
    }

    // continua com a adição da criptomoeda
    // ...
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 