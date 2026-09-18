"use client";

import { useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, CircularProgress, Snackbar, Alert, Checkbox,
    FormControlLabel
} from "@mui/material";
import "./premiumPanel.css";

interface PremiumPanelProps {
    isPremiumActive: boolean;
    premiumEndDate: string | null;
    premiumCancelDate: string | null;
    handleSubscribe: (cardInfo: { cardNumber: string; expiryDate: string; cvv: string }, saveCard: boolean) => void;
    handleCancelPremium: () => void;
}

const PremiumPanel: React.FC<PremiumPanelProps> = ({
    isPremiumActive, premiumEndDate, premiumCancelDate,
    handleSubscribe, handleCancelPremium
}) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [saveCard, setSaveCard] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [expiryError, setExpiryError] = useState("");
    const [cvvError, setCvvError] = useState("");

    const finalizePayment = () => {
        setShowPaymentModal(false);
        setLoadingPayment(true);

        setTimeout(() => {
            handleSubscribe({ cardNumber, expiryDate, cvv }, saveCard);
            setLoadingPayment(false);
            setShowSuccess(true);
        }, 3000);
    };
    const validateCardNumber = (number: string) => {
        return /^\d{16,}$/.test(number);
    };

    const validateExpiryDate = (date: string) => {
        if (!/^\d{2}\/\d{2}$/.test(date)) return false; 

        const [month, year] = date.split("/").map(num => parseInt(num, 10));
        if (month < 1 || month > 12) return false;

        const currentYear = new Date().getFullYear() % 100; 
        const currentMonth = new Date().getMonth() + 1;

        return year > currentYear || (year === currentYear && month >= currentMonth);
    };

    const validateCVV = (cvv: string) => {
        return /^\d{3}$/.test(cvv); 
    };


    const [cardError, setCardError] = useState("");

    const handlePayment = () => {
        let hasError = false;

        if (!/^\d{16,}$/.test(cardNumber)) {
            setCardError("Kart nömrəsi 16 rəqəmdən az ola bilməz");
            hasError = true;
        } else {
            setCardError("");
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            setExpiryError("Format: MM/YY olmalıdır");
            hasError = true;
        } else {
            const [month, year] = expiryDate.split("/").map(num => parseInt(num, 10));
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
                setExpiryError("Tarix keçmiş ola bilməz");
                hasError = true;
            } else {
                setExpiryError("");
            }
        }

        if (!/^\d{3}$/.test(cvv)) {
            setCvvError("CVV 3 rəqəm olmalıdır");
            hasError = true;
        } else {
            setCvvError("");
        }

        if (!hasError) {
            finalizePayment();
        }
    };


    return (
        <div className="premium-panel">
            <h2>🌟 Premium Üyelik</h2>
            {isPremiumActive ? (
                premiumCancelDate ? (
                    <p className="premium-text">📅 Premium üyeliğiniz <strong>{premiumEndDate}</strong> tarihinde otomatik olarak iptal edilecektir.</p>
                ) : (
                    <>
                        <p className="premium-text">✅ Premium üyeliğiniz aktiftir.</p>
                        <Button variant="contained" color="error" className="cancel-btn" onClick={() => setShowCancelConfirm(true)}>
                            ❌ Premium’u İptal Et
                        </Button>
                    </>
                )
            ) : (
                <>
                    <p className="premium-text">💎 Premium üye olun ve reklamsız, HD kalitede filmleri izleyin!</p>
                    <Button variant="contained" color="success" className="subscribe-btn" onClick={() => setShowPaymentModal(true)}>
                        🚀 Premium Ol
                    </Button>
                </>
            )}

            <Dialog open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
                <DialogTitle>Premium üyeliğinizi iptal etmek istediğinize emin misiniz?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setShowCancelConfirm(false)} color="primary">❌ Hayır</Button>
                    <Button onClick={() => { handleCancelPremium(); setShowCancelConfirm(false); }} color="error">✔️ Evet</Button>
                </DialogActions>
            </Dialog>

            <Dialog className="pre-cont-buy" open={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
                <DialogTitle>Kart Bilgilerinizi Girin</DialogTitle>
                <DialogContent>
                    <div className="input-group">
                        <TextField
                            fullWidth
                            label="💳 Kart Numarası"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            margin="dense"
                            error={!!cardError}
                            helperText={cardError}
                        />
                    </div>

                    <div className="input-group">
                        <TextField
                            fullWidth
                            label="📅 Son Kullanım Tarihi (MM/YY)"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            margin="dense"
                            error={!!expiryError}
                            helperText={expiryError}
                        />
                    </div>

                    <div className="input-group">
                        <TextField
                            fullWidth
                            label="🔒 CVV"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            margin="dense"
                            error={!!cvvError}
                            helperText={cvvError}
                        />
                    </div>

                    <FormControlLabel
                        control={<Checkbox checked={saveCard} onChange={() => setSaveCard(!saveCard)} />}
                        label="💾 Kart Bilgilerini Kaydet"
                        className="save-card-checkbox"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setShowPaymentModal(false)} color="error">İptal</Button>
                    <Button onClick={handlePayment} color="primary">💰 Ödemeyi Tamamla</Button>
                </DialogActions>
            </Dialog>

            {loadingPayment && (
                <div className="loading-overlay">
                    <CircularProgress className="loading-spinner" />
                    <p className="loading-text"></p>
                </div>
            )}

            <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
                <Alert severity="success" variant="filled">🎉 Tebrikler! Premium oldunuz!</Alert>
            </Snackbar>
        </div>
    );
};

export default PremiumPanel;
