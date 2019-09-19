<template>
    <div>
        <h1>{{result}}</h1>
        <form @submit.prevent="onSubmitForm"> <!-- v-on: => @ -->
            <input ref="answer" maxlength="4" v-model="value"/>
            <button type="submit">입력</button>
        </form>
        <div>시도: {{tries.length}}</div>
        <ul>
            <li v-for="t in tries">
                <div>{{t.try}}</div>
                <div>{{t.result}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    const getNumbers = () => {
        const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const array = [];
        for (let i = 0; i < 4; i++) {
            const chosen = candidates.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
            array.push(chosen);
        }
        return array;
    };

    export default {
        data() {
            return {
                answer: getNumbers(),
                tries: [],
                value: '',
                result: {},
            }
        },
        methods: {
            onSubmitForm(e) {

                // e.preventDefault(); // @submit.prevent
                if (this.value === this.answer.join('')){
                    this.tries.push({
                        try: this.value,
                        result: "성공",
                    })
                } else {
                    this.tries.push({
                        try: this.value,
                        result: '실패',
                    });
                }
                this.value = '';
                this.$refs.answer.focus();
            }
        }
    };
</script>

<style scoped>

</style>