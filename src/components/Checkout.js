function Checkout() {
  // ✅ Correct
  const [state, setState] = useState()
  
  // ❌ Incorrect - don't put hooks inside conditions
  if (something) {
    useEffect(() => {})
  }
} 