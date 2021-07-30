const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')

    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finanças:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("finanças:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {

    all: Storage.get(),
    /*[
        {
            description: "Energia",
            amount: -15000,
            date: "15/05/2021"
        },

        {
            description: "website",
            amount: 500000,
            date: "15/06/2021"
        },

        {
            description: "internet",
            amount: -15000,
            date: "18/07/2021"
        },
    ],*/

    add(transaction){
        Transaction.all.push(transaction)
        app.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        app.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expenses = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
            expenses += transaction.amount;
            }
        })
        return expenses; 
    },

    total() {
        
        return Transaction.incomes() + Transaction.expenses();    
    }
}

const DOM = {
  
    
    transactionsContainer: document.querySelector('#data-table tbody'),

        addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('income-display').innerHTML = utils.formatCurrency(Transaction.incomes())
        document.getElementById('expense-display').innerHTML = utils.formatCurrency(Transaction.expenses())
        document.getElementById('total-display').innerHTML = utils.formatCurrency(Transaction.total())
        

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) /100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value
        }
    },

    validateFields() {
        const { description, amount, date} = form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor preencha todos os campos!")
        }
    },

    formatValues() {
        let {description, amount, date} = form.getValues()

        amount = utils.formatAmount(amount)

        date = utils.formatDate(date)
        return {
            description, amount, date
        }
    },

    clearFields() {
        form.description.value = ""
        form.amount.value = ""
        form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            form.validateFields()
            const transaction = form.formatValues()
            Transaction.add(transaction)            
            form.clearFields()
            Modal.close()

        }catch (error) {
            alert(error.message)
        }
    }
}

const app = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        app.init()
    },
}

app.init();

