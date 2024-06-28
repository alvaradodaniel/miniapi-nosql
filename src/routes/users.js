const express = require("express");
const userSchema = require("../models/user");
const router = express.Router();


//CREAR USUARIO DE BBVA (INSERT)
router.post("/", (req, res) => {
  const user = userSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//PRUEBA PARA VER TODOS LOS USUARIOS DE BBVA
router.get("/", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//TRAER TODA LA INFORMACION DE UN SOLO USUARIO
router.get("/user/todo/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//TRAER INFORMACION ESPECIFICA DE UN SOLO USUARIO (ID, NAME, ACCOUNT_NUMBER, CARD_NUMBER) 
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .select("name email bank_account.account_number bank_account.cards.card_number bank_account.cards._id") // Seleccionar solo los campos deseados
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//GET USERS (JUST FOR TEST)
router.get("/", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//CREAR UNA TRANSACCION/COMPRA CON BBVA CON EL ID DE LA TARJETA
router.put("/user/transaction/:id", async (req, res) => {
  const { id } = req.params;
  const { cvv, account_number, card_number, datetime, description, amount, location, transaction_type, ip, mac_address, concept, reference } = req.body;

  try {
    const user = await userSchema.findOne({ _id: id });
    if (!user) {
      return res.json({ message: "Usuario no encontrado" });
    }

    const bankAccount = user.bank_account.find((account) => account.account_number === account_number);
    if (!bankAccount) {
      return res.json({ message: "Cuenta bancaria no encontrada" });
    }

    const card = bankAccount.cards.find((card) => card.card_number === card_number);
    if (!card) {
      return res.json({ message: "Tarjeta no encontrada" });
    }

    if (card.cvv !== cvv) {
      return res.json({ message: "CVV no coincide" });
    }

    const transaction = {
      datetime,
      description,
      amount,
      location,
      transaction_type,
      ip,
      mac_address,
      concept,
      reference,
    };

    card.transactions.push(transaction);

    await userSchema.updateOne({ _id: id }, { $set: { bank_account: user.bank_account } });
    res.json({ message: "Transacción realizada con éxito" });
  } catch (error) {
    res.json({ message: error });
  }
});

//ACTUALIZAR UN USUARIO
router.put("/user/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name, email, phone } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//ELIMINAR UN USUARIO
router.delete("/user/delete/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});



module.exports = router;
