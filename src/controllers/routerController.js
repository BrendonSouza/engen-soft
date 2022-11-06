const router = require("express").Router();
const bcrypt = require("bcrypt");
const session = require('../utils/session_config');
const authMiddleware = require('../utils/middleware/authMiddleware');
const env = require("dotenv").config();
var db = require('../utils/db_config');

router.get('/login', (req, res) => {
    res.render("login.ejs", { options: {} });
})


router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = $1", [username], async (err, result) => {

        if (err)
            throw err;

        if (result.rows.length > 0) {
            const { id, email } = result.rows[0];
            const isValid = await bcrypt.compare(password, result.rows[0].password)
            if (isValid) {
                req.session.user = { id, username, email };
                console.log(req.session.user);
                console.log("Logged in");
                res.redirect('/cadastro-requisito');
            }
            else {
                res.render("login.ejs", { options: { error: "Senha incorreta" } });
            }
        }
        else {
            res.render("login.ejs", { options: { error: "Usuário não encontrado" } });
        }


    });
});

router.get('/register', (req, res) => {
    res.render("register.ejs", { options: {} });
})

router.post('/register', async (req, res) => {
    //TODO incluir validação de nome repetido
    let { username, senha, email } = req.body;
    senha = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO users (username, password, email) VALUES ('${username}', '${senha}', '${email}')  RETURNING id`
   
    db.query(sql, (err, result) => {
        
        if (err){
            return res.render("register.ejs", { options: { error: "Username já existe" } });
        }
        res.redirect("/login");
    })
})


router.use(authMiddleware);
//rotas protegidas

router.get('/incluir-projeto', (req, res) => {
    res.render("inserir-projeto.ejs", { options: {} });
})

router.get('/cadastro-requisito', (req, res) => {
    //recupera os projetos do usuário
    const sql = `SELECT * FROM projeto WHERE id_users = ${req.session.user.id}`
    db.query(sql, (err, result) => {
        if (err||result.rowCount == 0){
            return res.redirect('/incluir-projeto');
        }
        res.render("cadastro-requisito.ejs", { options: { filecss: "styles/requisitos.css", projects: result.rows } });
    })
    // res.render("cadastro-requisito.ejs", { options: { filecss: "styles/requisitos.css" } });
})

router.post('/cadastro-requisito', async (req, res) => {
    const { crud, entidade, atributos, projeto } = req.body;
    console.log(projeto)
    const { pre, um, com } = { pre: "O sistema deve", um: "um(a)", com: "com" }
    const descricao = `${pre} ${crud} ${um} ${entidade} ${com} ${atributos}`;
    const sql = `INSERT INTO requisitos_de_usuario (descritivo, id_projeto) VALUES ('${descricao}', ${projeto}) RETURNING id`
    const idRequsitoUsuario = (await db.query(sql)).rows[0].id;

    const nomeReq = "RF0" + idRequsitoUsuario;

    const sql2 = `INSERT INTO requisitos_funcionais (id_requisitos_de_usuario, nome) VALUES (${idRequsitoUsuario},${nomeReq}) RETURNING id`
    const idRequsitoFuncional = (await db.query(sql2)).rows[0].id;

    const sql3 = ` INSERT INTO requisitos_de_crud (tipo, id_requisitos_funcionais) VALUES ('${crud}', ${idRequsitoFuncional}) RETURNING id`
    const idRequisitoCrud = (await db.query(sql3)).rows[0].id;

    const sql4 = ` INSERT INTO entidades (nome,id_requisitos_de_crud ) VALUES ('${entidade}', ${idRequisitoCrud}) RETURNING id`
    const idEntidade = (await db.query(sql4)).rows[0].id;

    // //separa atributos por virgula
    const atributosArray = atributos.split(",");
    atributosArray.forEach((atributo) => {
        const sql5 = ` INSERT INTO atributos (nome, id_entidades) VALUES ('${atributo}', ${idEntidade})`
        db.query(sql5, (err, result) => {
            if (err) throw err;

        })
    })
    res.redirect("/cadastro-requisito");

})

router.post('/incluir-projeto', async (req, res) => {

    //TODO Incluir validação de nome repetido
    const { nome, descricao } = req.body;
    const user_id = req.session.user.id;

    const sql = `INSERT INTO projeto (nome, descricao,id_users) VALUES ('${nome}', '${descricao}',${user_id}) RETURNING id`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect("/cadastro-requisito");
    })
})

exports = module.exports = router;