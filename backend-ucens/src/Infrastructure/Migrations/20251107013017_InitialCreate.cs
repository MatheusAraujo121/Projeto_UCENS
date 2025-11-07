using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Associados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Cognome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CPF = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Rg = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Sexo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    EstadoCivil = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    NomePai = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NomeMae = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Cep = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Endereco = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Bairro = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Numero = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Complemento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Telefone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    LocalNascimento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Nacionalidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Profissao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Situacao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    GrauInstrucao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Associados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Atividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ImagemUrl = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    ExigePiscina = table.Column<bool>(type: "boolean", nullable: false),
                    ExigeFisico = table.Column<bool>(type: "boolean", nullable: false),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DiasDisponiveis = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    HorarioSugerido = table.Column<TimeSpan>(type: "interval", nullable: true),
                    IdadeMinima = table.Column<int>(type: "integer", nullable: true),
                    IdadeMaxima = table.Column<int>(type: "integer", nullable: true),
                    LimiteParticipantes = table.Column<int>(type: "integer", nullable: true),
                    Local = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ProfessorResponsavel = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Acontecimentos = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atividades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CarouselImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ImageUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarouselImages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CnabRetornos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChaveUnica = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    NossoNumero = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NumeroDocumento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DataOcorrencia = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ValorTitulo = table.Column<decimal>(type: "numeric", nullable: false),
                    ValorPago = table.Column<decimal>(type: "numeric", nullable: false),
                    CodigoOcorrencia = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    DescricaoOcorrencia = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CnabRetornos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Eventos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Local = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Fim = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImagemUrl = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Responsavel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    LimiteCredito = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Valor = table.Column<decimal>(type: "numeric", nullable: false),
                    Data = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Senha = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Boletos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssociadoId = table.Column<int>(type: "integer", nullable: false),
                    Valor = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataEmissao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataPagamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ValorPago = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    NossoNumero = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MotivoCancelamento = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    JurosMora = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PercentualMulta = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    NumeroArquivoRemessa = table.Column<int>(type: "integer", nullable: false),
                    SequencialNossoNumero = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boletos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boletos_Associados_AssociadoId",
                        column: x => x.AssociadoId,
                        principalTable: "Associados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dependentes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Rg = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    DataNascimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Sexo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    NomePai = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    NomeMae = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Situacao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    GrauParentesco = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DataLimite = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Cognome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    NumeroCarteirinha = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ValidadeCarteirinha = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Cpf = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: true),
                    LocalNascimento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Nacionalidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EstadoCivil = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    GrauInstrucao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Profissao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Exames = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AtividadesProibidas = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AssociadoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dependentes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dependentes_Associados_AssociadoId",
                        column: x => x.AssociadoId,
                        principalTable: "Associados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Turmas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Professor = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    DiasHorarios = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Vagas = table.Column<int>(type: "integer", nullable: false),
                    AtividadeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Turmas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Turmas_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Despesas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Valor = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataPagamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FormaPagamento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    NumeroFatura = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    MultaJuros = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AnexoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FornecedorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Despesas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Despesas_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatriculasAssociados",
                columns: table => new
                {
                    AssociadoId = table.Column<int>(type: "integer", nullable: false),
                    TurmaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatriculasAssociados", x => new { x.AssociadoId, x.TurmaId });
                    table.ForeignKey(
                        name: "FK_MatriculasAssociados_Associados_AssociadoId",
                        column: x => x.AssociadoId,
                        principalTable: "Associados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatriculasAssociados_Turmas_TurmaId",
                        column: x => x.TurmaId,
                        principalTable: "Turmas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatriculasDependentes",
                columns: table => new
                {
                    DependenteId = table.Column<int>(type: "integer", nullable: false),
                    TurmaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatriculasDependentes", x => new { x.DependenteId, x.TurmaId });
                    table.ForeignKey(
                        name: "FK_MatriculasDependentes_Dependentes_DependenteId",
                        column: x => x.DependenteId,
                        principalTable: "Dependentes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatriculasDependentes_Turmas_TurmaId",
                        column: x => x.TurmaId,
                        principalTable: "Turmas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Boletos_AssociadoId",
                table: "Boletos",
                column: "AssociadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Dependentes_AssociadoId",
                table: "Dependentes",
                column: "AssociadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Despesas_FornecedorId",
                table: "Despesas",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_MatriculasAssociados_TurmaId",
                table: "MatriculasAssociados",
                column: "TurmaId");

            migrationBuilder.CreateIndex(
                name: "IX_MatriculasDependentes_TurmaId",
                table: "MatriculasDependentes",
                column: "TurmaId");

            migrationBuilder.CreateIndex(
                name: "IX_Turmas_AtividadeId",
                table: "Turmas",
                column: "AtividadeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Boletos");

            migrationBuilder.DropTable(
                name: "CarouselImages");

            migrationBuilder.DropTable(
                name: "CnabRetornos");

            migrationBuilder.DropTable(
                name: "Despesas");

            migrationBuilder.DropTable(
                name: "Eventos");

            migrationBuilder.DropTable(
                name: "MatriculasAssociados");

            migrationBuilder.DropTable(
                name: "MatriculasDependentes");

            migrationBuilder.DropTable(
                name: "Transacoes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "Dependentes");

            migrationBuilder.DropTable(
                name: "Turmas");

            migrationBuilder.DropTable(
                name: "Associados");

            migrationBuilder.DropTable(
                name: "Atividades");
        }
    }
}
