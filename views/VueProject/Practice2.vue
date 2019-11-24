<template>
    <div>
        <h1>{{result}}</h1>
        <table>
            <tr>
                <td v-on:click="onSubmit(0,0)">{{simon[0][0]}}</td>
                <td v-on:click="onSubmit(0,1)">{{simon[0][1]}}</td>
                <td v-on:click="onSubmit(0,2)">{{simon[0][2]}}</td>
            </tr>
            <tr>
                <td v-on:click="onSubmit(1,0)">{{simon[1][0]}}</td>
                <td v-on:click="onSubmit(1,1)">{{simon[1][1]}}</td>
                <td v-on:click="onSubmit(1,2)">{{simon[1][2]}}</td>
            </tr>
            <tr>
                <td v-on:click="onSubmit(2,0)">{{simon[2][0]}}</td>
                <td v-on:click="onSubmit(2,1)">{{simon[2][1]}}</td>
                <td v-on:click="onSubmit(2,2)">{{simon[2][2]}}</td>
            </tr>
        </table>
    </div>
</template>

<script>


    export default {

        data() {
            return {
                result: '',
                simon: [['', '', ''], ['', '', ''], ['', '', '']],
                turn: true,
            }
        },
        methods: {

            cross_EndGame: function(){
              if(this.simon[0][0] === 'O' && this.simon[1][1] === 'O' && this.simon[2][2] === 'O'){
                  return this.result = 'O의 승리!';
              }
              else if(this.simon[0][2] === 'O' && this.simon[1][1] === 'O' && this.simon[2][0] === 'O'){
                  return this.result = 'O의 승리!';
              }

              if(this.simon[0][0] === 'X' && this.simon[1][1] === 'X' && this.simon[2][2] === 'X'){
                  return this.result = 'X의 승리!';
              }

              else if(this.simon[0][2] === 'X' && this.simon[1][1] === 'X' && this.simon[2][0] === 'X'){
                  return this.result ='X의 승리!'
              }
            },

            column_EndGame: function () {
                var a = [];

                for (var i = 0; i < 3; i++) {
                    let count = 0;
                    let is_empty = 0;
                    for (var j = 0; j < 3; j++) {
                        if (this.simon[i][j] === 'O') {
                            count++;
                        } else if (this.simon[i][j] === '') {
                            is_empty++;
                        }
                    }
                    if (is_empty > 0) {
                        continue
                    } else {
                        if (count === 3) {
                            return this.result = 'O의 승리!';
                        } else if (count === 0) {
                            return this.result = 'X의 승리!';
                        }
                    }

                }
            },

            row_Endgame: function () {
                for (var i = 0; i < 3; i++) {
                    let count = 0;
                    let is_empty = 0;
                    for (var j = 0; j < 3; j++) {
                        if (this.simon[j][i] === 'O') {
                            count++;
                        } else if (this.simon[j][i] === '') {
                            is_empty++;
                        }
                    }
                    if (is_empty > 0) {
                        continue
                    } else {
                        if (count === 3) {
                            return this.result = 'O의 승리!';
                        } else if (count === 0) {
                            return this.result = 'X의 승리!';
                        }
                    }

                }
            }
            ,

            onSubmit: function (e, a) {
                console.log(this.simon[e][a]);
                if (this.simon[e][a] !== '') {
                    alert("빈칸이 아닙니다.");
                } else {
                    if (this.turn === true) {
                        this.$set(this.simon[e], a, 'O');
                        console.log(this.simon[e][a]);
                        this.turn = false;
                    } else {
                        this.$set(this.simon[e], a, 'X');
                        console.log(this.simon[e][a]);
                        this.turn = true;
                    }
                }
                this.row_Endgame();
                this.column_EndGame();
                this.cross_EndGame();
            }
        }
    };
</script>

<style>

</style>